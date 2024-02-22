const wallet = require('../model/wallet');



const walletAmount = async (req,res,next)=>{

    const userId = req.params.id
    const amountString = req.body

    const amount = parseInt(amountString.amount);


        try {
            let userWallet = await wallet.findOne({ userId: userId });
    
            if (!userWallet) {
                // If the wallet doesn't exist, create one
                userWallet = await wallet.create({
                    userId: userId,
                    balance: 0,
                    transactions: []
                });
            }
    
            // Perform the deposit
            await userWallet.updateOne({
                $push: {
                    transactions: {
                        type: 'deposit',
                        status: 'completed',
                        amount:amount ,
                        timestamp: Date.now()
                    }
                },
                $inc: {
                    balance: amount// Increment balance with the deposit amount
                }
            });
    
            res.status(201).json({ message: "Deposit Successful" });
    
        } catch (error) {
            console.error(error);
           next(error)
        }
}


// withdraw from the wallet
const withDrawal = async (req,res,next) => {
    const userId = req.params.id;
    const amountString = req.body;
    const amount = parseInt(amountString.amount);


    try {
        let userWallet = await wallet.findOne({ userId: userId });

        if (!userWallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        if (userWallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Perform the withdrawal
        await userWallet.updateOne({
            $push: {
                transactions: {
                    type: 'withdrawal',
                    status: 'completed',
                    amount: amount,
                    timestamp: Date.now()
                }
            },
            $inc: {
                balance: -amount // Decrement balance with the withdrawal amount
            }
        });

        res.status(200).json({ message: "Withdrawal Successful" });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error");
    }
};




module.exports = {
    walletAmount,
    withDrawal,
}


