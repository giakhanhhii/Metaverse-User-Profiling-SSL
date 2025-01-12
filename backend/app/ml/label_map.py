INTEREST_LABELS = [
    "advertise", "animal", "art", "baby", "beach", "beauty", "books", "cars",
    "cooking", "education", "fashion", "finance", "fitness", "food", "gaming",
    "garden", "health", "home", "humor", "music", "nature", "parenting", "pets",
    "politics", "religion", "shopping", "sport", "tech", "travel", "wedding",
]

# Maps interest labels → ad segments
AD_SEGMENT_MAP: dict[str, list[str]] = {
    "food":       ["F&B Brands", "Meal Delivery", "Restaurant Chains"],
    "cooking":    ["Kitchen Appliances", "Meal Kits", "Cookware"],
    "travel":     ["Tourism", "Airlines", "Hotels & Resorts"],
    "beach":      ["Tourism", "Swimwear", "Suncare Brands"],
    "fashion":    ["Apparel & Retail", "Luxury Fashion", "Fast Fashion"],
    "beauty":     ["Cosmetics", "Skincare", "Beauty Tools"],
    "tech":       ["Electronics", "Software & Apps", "Gadgets"],
    "gaming":     ["Gaming Platforms", "PC Hardware", "In-game Ads"],
    "sport":      ["Sportswear", "Sports Equipment", "Fitness Apps"],
    "fitness":    ["Gym Memberships", "Supplements", "Fitness Gear"],
    "health":     ["Healthcare", "Pharmaceuticals", "Wellness Apps"],
    "music":      ["Streaming Services", "Music Equipment", "Events"],
    "art":        ["Art Supplies", "Design Tools", "Online Courses"],
    "education":  ["Online Learning", "Textbooks", "EdTech Platforms"],
    "pets":       ["Pet Food", "Veterinary Services", "Pet Accessories"],
    "animal":     ["Wildlife Conservation", "Pet Products", "Nature Tourism"],
    "baby":       ["Baby Products", "Parenting Apps", "Childcare"],
    "parenting":  ["Family Services", "Education Toys", "Insurance"],
    "home":       ["Home Décor", "Real Estate", "Home Appliances"],
    "garden":     ["Gardening Tools", "Plant Shops", "Outdoor Furniture"],
    "cars":       ["Auto Brands", "Car Insurance", "Auto Accessories"],
    "shopping":   ["E-commerce", "Retail Ads", "Discount Platforms"],
    "finance":    ["Banking", "Investment Apps", "Insurance"],
    "nature":     ["Eco Products", "Nature Tourism", "Conservation"],
    "humor":      ["Entertainment Platforms", "Social Media Ads"],
    "books":      ["Publishing", "E-readers", "Online Bookstores"],
    "music":      ["Streaming Services", "Music Equipment"],
    "politics":   ["Civic Organizations", "News Media"],
    "religion":   ["Religious Organizations", "Spiritual Wellness"],
    "wedding":    ["Wedding Services", "Jewelry", "Event Planning"],
    "advertise":  ["General Brand Awareness"],
}


def get_ad_segments(interests: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for label in interests:
        for seg in AD_SEGMENT_MAP.get(label, []):
            if seg not in seen:
                seen.add(seg)
                result.append(seg)
    return result[:6]  # cap at 6 segments
