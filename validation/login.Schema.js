import joi from 'joi'

const loginSChema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().required().min(4).max(10),
})

module.exports=loginSChema;