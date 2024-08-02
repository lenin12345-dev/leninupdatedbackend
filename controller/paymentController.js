const paymentService=require("../services/paymentService.js")

const createPaymentLink=async(req,res)=>{

    try {
        const paymentLink=await paymentService.createPaymentLink(req.params.id);
        return res.status(200).json(paymentLink)
    } catch (error) {
        return res.status(500).json(error.message);
    }

}

const updatePaymentInformation=async(req,res)=>{

    try {
        await paymentService.updatePaymentInformation(req.query)
        return res.status(200).send({message:"payment information updated",status:true})
    } catch (error) {
        console.error('Error updating payment information:', error);
        return res.status(500).send(error.message);
    }

}

module.exports={createPaymentLink,updatePaymentInformation}