
const httpError = require('../models/error');

const user = require('../models/user');

const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken')




const signup = async (req, res, next) =>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next
            (new httpError('invalid input passed ', 422));

    }

    const { name, email, password } = req.body;
    let existinguser;
    try {

        existinguser = await user.findOne({ email: email })

    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }

    if (existinguser) {
        const error = new httpError(
            'user exist',
            422
        );
        return next(error);
    }


    const createduser = new user({

        name,
        email,
        password,
        produits: []
    });

    try {
        await createduser.save();
    } catch (err) {
        const error = new httpError('failed signup', 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createduser.id, email: createduser.email },
            'secret-thinks',
            { expiresIn: '1h' }
        );

    } catch (err) {
        const error = new httpError('failed signup try again later', 500);
        return next(error);

    }




    res.status(201).json({ userId: createduser.id, email:createduser.email, token:token });


}

const getUser = async (req,res,next)=>{

    let existingUser;

    try{
        existingUser = await user.find({},'-password')
    }catch{
        const error = new httpError('failed signup try again later', 500);
        return next(error); 
    }

    res.json({existingUser:existingUser})

}

const updateUser = async (req,res,next)=>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next
            (new httpError('invalid input passed ', 422));

    }

    const {name,email,password}=req.body
    const UserId = req.params.userId

    let existingUser;

    try{
        existingUser = await user.findById(UserId)
    }catch{
        return next
            (new httpError('failed !! ', 500));
    }

    existingUser.name=name;
    existingUser.email=email;
    existingUser.password=password;

    try{
        existingUser.save()

    }catch{
        return next
            (new httpError('failed to save !! ', 500));
    }
    
    res.status(200).json({existingUser:existingUser})

}

const deleteUser = async (req,res,next)=>{
    const id = req.params.id

    let existingUser;

    try{
        existingUser = await user.findById(id)
    }catch{
        return next
            (new httpError('failed !! ', 500));
    }

    if(!existingUser){
        return next
            (new httpError('user does not exist !!', 422));
    }

    console.log(existingUser)

    try{
        existingUser.remove()
    }catch{
        return next
            (new httpError('failed !!!', 500));
    }

    res.status(200).json({message:"deleted"})
}


const login = async (req,res,next)=>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next
            (new httpError('invalid input passed ', 422));

    }

    const {email,name}=req.body

    let existingUser 

    try {
        existingUser = await user.findOne({email: email})
    }catch{
        return next
            (new httpError('failed !!', 500));
    }

    if((!existingUser) || (existingUser.name !== name)){
        return next
            (new httpError('invalid input passed ', 422));
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'secret-thinks',
            { expiresIn: '1h' }
        );

    } catch (err) {
        const error = new httpError('failed signup try again later', 500);
        return next(error);

    }


    res.status(200).json({user:existingUser, token:token})
     
}





exports.signup=signup
exports.getUser=getUser
exports.updateUser=updateUser
exports.deleteUser=deleteUser
exports.login=login