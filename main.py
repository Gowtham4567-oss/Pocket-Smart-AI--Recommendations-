import os
from io import BytesIO
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from PIL import Image

app = FastAPI(title="PocketSmart AI")

# CORS middleware enable panrom
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini Client initialize panrom
client = genai.Client()


@app.post("/api/recommend")
async def get_recommendations(
    category: str = Form(...),
    budget: float = Form(...),
    image: UploadFile = File(None),
):
    try:
        prompt = f"""
        You are PocketSmart AI, a smart budget recommendation assistant in India.
        Category: {category}
        Budget: ₹{budget}
        
        Provide 3 smart recommendations matching the user's budget and category.
        If an image is provided (like a floor plan, party setup, or jewelry design), analyze it and tailor recommendations based on it.
        Return the response strictly as a JSON array with items having 'name', 'price', and 'description'.
        """

        contents = [prompt]

        if image:
            image_bytes = await image.read()
            pil_image = Image.open(BytesIO(image_bytes))
            contents.append(pil_image)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )

        return {"status": "success", "recommendations": response.text}

    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
