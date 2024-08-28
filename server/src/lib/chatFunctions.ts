const users: any[] = []

const addUser = ({ id, username, room }: { id: string, username: string, room: string }) => {
    // Clean The Data
    username = username.trim()
    room = room.trim().toLowerCase()
    // Validate Data
    if (!username || !room) {
        return {
            error: "Username And Room Are Required"
        }
    }
    // Check For Existing User
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    // Validate Username
    if (existingUser) {
        return {
            error: "Already Joined The Room"
        }
    }
    // Store User
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id: string) => {
    if (!id) { return "ID Not Provided" }
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    } else {
        return "User Not Found"
    }
}

const getUser = (id: string) => {
    if (!id) { return "ID Not Provided" }
    const matchedUser = users.find((user) => user.id === id)
    if (!matchedUser) { return `No User Found With ID ${id}` }
    return matchedUser
}


export { addUser, removeUser, getUser }