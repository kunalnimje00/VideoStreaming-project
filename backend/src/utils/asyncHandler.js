const asyncHandler = (requestHandler) =>{
    return (req, res, next)=>{
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }




// // // // this is tey catch technique using higher order, on up is promise type

// const asynHandler = (fn) => async(req, res, next) =>{       // this is higher oreder function
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
