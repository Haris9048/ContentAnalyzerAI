
import json
import time

from google import genai
from google.genai import errors

from .config import settings


# --------------------------------------------------
# GEMINI CLIENT
# --------------------------------------------------

def get_client():
    if not settings.GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is missing in backend/.env"
        )

    return genai.Client(
        api_key=settings.GEMINI_API_KEY
    )


# --------------------------------------------------
# JSON RESPONSE CLEANER
# --------------------------------------------------

def parse_json_response(result: str):
    cleaned = result.strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.replace("```json", "", 1)
        cleaned = cleaned.replace("```", "").strip()

    return json.loads(cleaned)


# --------------------------------------------------
# GEMINI TEXT GENERATION WITH RETRIES
# --------------------------------------------------

def generate_text(prompt: str) -> str:
    client = get_client()

    primary_model = settings.GEMINI_MODEL
    fallback_model = getattr(
        settings,
        "GEMINI_FALLBACK_MODEL",
        None
    )

    models = [primary_model]

    if fallback_model and fallback_model != primary_model:
        models.append(fallback_model)

    last_error = None

    for model in models:

        for attempt in range(3):

            try:
                print(
                    f"Generating content using {model} "
                    f"(attempt {attempt + 1}/3)"
                )

                response = client.models.generate_content(
                    model=model,
                    contents=prompt
                )

                if not response.text:
                    raise RuntimeError(
                        f"Gemini returned an empty response using {model}"
                    )

                return response.text

            except errors.ServerError as error:
                last_error = error

                print(
                    f"Temporary Gemini server error with {model}: {error}"
                )

                if attempt < 2:
                    time.sleep(2 ** (attempt + 1))

            except errors.ClientError as error:
                last_error = error

                print(
                    f"Gemini client error with {model}: {error}"
                )

                # Try the fallback model for model-related errors.
                break

    raise RuntimeError(
        f"Gemini generation failed. Last error: {last_error}"
    )


# --------------------------------------------------
# VIDEO PERFORMANCE ANALYSIS
# --------------------------------------------------

def analyze_video(
    title: str,
    notes: str,
    metrics: dict
) -> dict:

    prompt = f"""
You are an expert Instagram Reels growth strategist.

Analyze the following Instagram Reel information.

IMPORTANT:
You are NOT watching or viewing the actual video.
You only have the title, creator notes and performance metrics.
Do not pretend that you have seen the video.

VIDEO TITLE:
{title}

CREATOR NOTES:
{notes}

PERFORMANCE METRICS:
{json.dumps(metrics, indent=2)}

Provide a practical analysis.

Return your response in valid JSON with these fields:

{{
    "overall_score": 0,
    "performance_summary": "",
    "what_worked": [],
    "what_didnt_work": [],
    "audience_insights": [],
    "improvements": [],
    "hook_analysis": "",
    "content_strategy": "",
    "next_steps": []
}}

Rules:
- overall_score must be between 0 and 100.
- Be realistic and specific.
- Do not invent information about the video.
- Explain performance using the supplied metrics.
- Keep the recommendations practical for an Instagram creator.
- Return only valid JSON.
"""

    result = generate_text(prompt)

    try:
        return parse_json_response(result)

    except json.JSONDecodeError:
        return {
            "overall_score": 0,
            "performance_summary": result,
            "what_worked": [],
            "what_didnt_work": [],
            "audience_insights": [],
            "improvements": [],
            "hook_analysis": "",
            "content_strategy": "",
            "next_steps": []
        }


# --------------------------------------------------
# INSTAGRAM REEL IDEAS
# --------------------------------------------------

def generate_ideas(topic: str) -> dict:

    prompt = f"""
You are an Instagram content strategist.

Generate 10 Instagram Reel ideas for this topic:

{topic}

Return valid JSON in this format:

{{
    "ideas": [
        {{
            "title": "",
            "hook": "",
            "concept": "",
            "format": "",
            "cta": ""
        }}
    ]
}}

Make the ideas practical, creative and suitable for organic growth.

Avoid repetitive ideas.
Make the hooks interesting and attention-grabbing.
Keep concepts practical for creators.

Return only valid JSON.
"""

    result = generate_text(prompt)

    try:
        return parse_json_response(result)

    except json.JSONDecodeError:
        return {
            "ideas": [],
            "raw_response": result
        }


# --------------------------------------------------
# INSTAGRAM CONTENT GENERATION
# --------------------------------------------------

def generate_content(topic: str) -> dict:

    prompt = f"""
You are an expert Instagram scriptwriter and content strategist.

Create content for this topic:

{topic}

Return valid JSON:

{{
    "reel_script": "",
    "caption": "",
    "hooks": [],
    "cta": "",
    "hashtags": []
}}

Make the script engaging, natural and suitable for short-form video.

Rules:
- Write a strong opening hook.
- Keep the script conversational.
- Avoid robotic language.
- Make the caption engaging.
- Provide relevant hashtags.
- Return only valid JSON.
"""

    result = generate_text(prompt)

    try:
        return parse_json_response(result)

    except json.JSONDecodeError:
        return {
            "raw_response": result
        }
