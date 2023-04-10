const BASE_URL = "http://localhost:3000"

const getAllPosts = async () => {
    let response = await fetch(`${BASE_URL}/posts?_sort=score&_order=desc`)
    return response.json()
}

const newPost = async ({title, url, score}) => {
    let reponse = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            url: url,
            score: score
        })
    })
    return reponse.json()
}

const updateScore = async ({id, score}) => {
    let response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            score: score
        })
    })
    return response.json()
}
   
export { getAllPosts, newPost, updateScore }