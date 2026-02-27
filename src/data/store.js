import seed from './seed.json'

const clone = (value) => JSON.parse(JSON.stringify(value))

let state = clone(seed)
let counters = {
  user: 0,
  comment: 0
}

const getMaxId = (items, prefix) => {
  return items.reduce((max, item) => {
    if (!item.id || !item.id.startsWith(prefix)) {
      return max
    }
    const numeric = Number(item.id.slice(prefix.length))
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max
  }, 0)
}

export const initializeData = () => {
  state = clone(seed)
  counters = {
    user: getMaxId(state.users, 'u'),
    comment: getMaxId(state.comments, 'c')
  }
}

initializeData()

export const getUsers = () => clone(state.users)

export const getUser = (id) => {
  const match = state.users.find((user) => user.id === id)
  return match ? clone(match) : null
}

export const getPost = (id) => {
  if (state.post && state.post.id === id) {
    return clone(state.post)
  }
  return null
}

export const getComments = (postId) => {
  return clone(state.comments.filter((comment) => comment.postId === postId))
}

export const createUser = ({ name, handle, bio, location }) => {
  counters.user += 1
  const id = `u${counters.user}`
  const nextUser = {
    id,
    name,
    handle,
    bio: bio || '',
    location: location || '',
    avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=signal-${id}`
  }
  state.users.push(nextUser)
  return clone(nextUser)
}

export const validateComment = (body, authorId) => {
  if (!body || typeof body !== 'string') {
    return 'Comment body is required.'
  }
  const trimmed = body.trim()
  if (trimmed.length === 0) {
    return 'Comment cannot be empty.'
  }
  if (trimmed.length > 500) {
    return 'Comment cannot exceed 500 characters.'
  }
  if (!authorId) {
    return 'Author ID is required.'
  }
  const author = state.users.find((user) => user.id === authorId)
  if (!author) {
    return 'Invalid author ID.'
  }
  return null
}

export const createComment = ({ postId, authorId, body }) => {
  const validationError = validateComment(body, authorId)
  if (validationError) {
    throw new Error(validationError)
  }
  
  counters.comment += 1
  const id = `c${counters.comment}`
  const nextComment = {
    id,
    postId,
    authorId,
    body: body.trim(),
    createdAt: new Date().toISOString()
  }
  state.comments.push(nextComment)
  return clone(nextComment)
}
