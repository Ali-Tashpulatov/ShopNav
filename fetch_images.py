import urllib.request
import json
import os

def search_and_download(keyword, filename):
    print(f"Searching for {keyword}...")
    # Using Wikimedia API to search for images
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(keyword)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data['query']['pages']
            for page_id in pages:
                image_url = pages[page_id]['imageinfo'][0]['url']
                print(f"Downloading {image_url}...")
                urllib.request.urlretrieve(image_url, filename)
                return True
    except Exception as e:
        print(f"Error for {keyword}: {e}")
    return False

search_and_download("baby products diapers", "img/cat_baby.jpg")
search_and_download("international food dishes", "img/cat_international.jpg")
search_and_download("healthy diet food", "img/cat_special.jpg")
search_and_download("protein powder supplements", "img/cat_fitness.jpg")
search_and_download("fresh organic vegetables", "img/cat_organic.jpg")

