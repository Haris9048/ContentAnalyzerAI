def calculate_engagement(metrics: dict) -> float:
    reach = metrics.get("reach", 0)

    if reach <= 0:
        reach = metrics.get("views", 0)

    if reach <= 0:
        return 0.0

    interactions = (
        metrics.get("likes", 0)
        + metrics.get("comments", 0)
        + metrics.get("shares", 0)
        + metrics.get("saves", 0)
    )

    return round((interactions / reach) * 100, 2)


def calculate_totals(video_list: list) -> dict:
    totals = {
        "videos": len(video_list),
        "views": 0,
        "likes": 0,
        "comments": 0,
        "shares": 0,
        "saves": 0,
        "reach": 0,
        "followers_gained": 0
    }

    for video in video_list:
        metrics = video.get("metrics", {})

        for key in totals:
            if key == "videos":
                continue

            totals[key] += metrics.get(key, 0)

    totals["engagement_rate"] = calculate_engagement({
        "views": totals["views"],
        "reach": totals["reach"],
        "likes": totals["likes"],
        "comments": totals["comments"],
        "shares": totals["shares"],
        "saves": totals["saves"]
    })

    return totals