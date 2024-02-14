import { collections } from "./mongo";
import { Post } from "./types";

export async function getUser(userId: string) {
    try {
        let user = await collections.users.findOne({userId: userId})
        if(!user) {
            collections.users.insertOne({
                userId: userId,
                posts: [],
            })
            user = await collections.users.findOne({userId: userId})
        }
        return user
    } catch {console.log}
}
export async function addPost(post: Post) {
    try {
        const postEx = await collections.posts.findOne({id: post.id})
        let user = await getUser(post.creatorId)
        if(user) {
            user.posts.push(post.id)
            if(postEx) return
            collections.users.updateOne({userId: post.creatorId}, {
                $set: {
                    userId: post.creatorId,
                    posts: user.posts,
                }
            })
            collections.posts.insertOne(post)
        }
    } catch {console.log}
    return
}
export async function deletePost(postId: string) {
    try {
        const post = await getPost(postId)
        let user = await getUser(post?.creatorId || '')
        if(user) {
            let gI = 0
            user.posts.map((userPostId, index) => {
                if(userPostId == postId) gI = index
                return
            })
            user.posts.splice(gI)
            if(post) {
                collections.users.updateOne({userId: user.userId}, {
                    $set: {
                        userId: user.userId,
                        posts: user.posts
                    }
                })
                collections.posts.deleteOne({id: postId})
            }
        }
    } catch {console.log}
    return
}
export async function getPost(postId: string) {
    try {
        const post = await collections.posts.findOne({id: postId})
        return post
    } catch {console.log}
    return
}
export async function updateBump(postId: string) {
    try {
        let post = await collections.posts.findOne({id: postId})
        if(post) {
            post.stats.times.bumped = Date.now()
            post.stats.flags.checked = true
            collections.posts.updateOne({id: postId},{$set: post})
        }
    } catch {console.log}
    return
}
export async function updateMessage(postId: string, msg: {id: string, url: string}) {
    try {
        let post = await collections.posts.findOne({id: postId})
        if(post) {
            post.stats.message = msg
            collections.posts.updateOne({id: postId},{$set: post})
        }
    } catch {console.log}
    return
}
export async function updateApproval(postId: string) {
    try {
        let post = await collections.posts.findOne({id: postId})
        if(post) {
            post.stats.approved = true
            collections.posts.updateOne({id: postId},{$set: post})
        }
    } catch {console.log}
    return
}