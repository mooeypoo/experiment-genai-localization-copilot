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

const generateHandle = (name) => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15)
  
  let handle = base
  let suffix = 1
  
  while (state.users.some((user) => user.handle === handle)) {
    handle = `${base}${suffix}`
    suffix++
  }
  
  return handle || `user${counters.user + 1}`
}

export const validateUser = (name, bio, pronouns) => {
  if (!name || typeof name !== 'string') {
    return 'Display name is required.'
  }
  const trimmedName = name.trim()
  if (trimmedName.length === 0) {
    return 'Display name cannot be empty.'
  }
  if (trimmedName.length > 100) {
    return 'Display name cannot exceed 100 characters.'
  }
  if (bio && typeof bio === 'string' && bio.trim().length > 500) {
    return 'Bio cannot exceed 500 characters.'
  }
  if (pronouns && typeof pronouns === 'string') {
    const validPronouns = ['she/her', 'he/him', 'they/them', 'any']
    if (!validPronouns.includes(pronouns)) {
      return 'Invalid pronouns selection.'
    }
  }
  return null
}

export const createUser = ({ name, bio, pronouns }) => {
  const validationError = validateUser(name, bio, pronouns)
  if (validationError) {
    throw new Error(validationError)
  }
  
  counters.user += 1
  const id = `u${counters.user}`
  const handle = generateHandle(name)
  const nextUser = {
    id,
    name: name.trim(),
    handle,
    pronouns: pronouns || 'they/them',
    bio: bio ? bio.trim() : '',
    location: '',
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
