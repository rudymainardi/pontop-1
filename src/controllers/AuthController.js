const Collaborators = require('../models/Collaborators');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../modules/mailer');

require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
  async authenticate(req, res){
    
    try{
      const { cpf, password } = req.body;
      const collaborator = await Collaborators.findOne({ cpf }).select('+password');
      
      if (!collaborator || !password){
        return res.status(401).send({
          success: false,
          error: "Collaborator/Password invalid",
        });
      };
        
      if(collaborator && !collaborator.password && password){
        const hash = await bcrypt.hash(password, 10);
        const collaborator = await Collaborators.findOneAndUpdate({ cpf }, { password: hash });

        return res.status(200).send({
          success: true,
          message: "Collaborator created",
          collaborator,
          token: jwt.sign({ id: collaborator._id }, jwtSecret, { expiresIn: '1d' }),
        });

      }; 

      if(!await bcrypt.compare(password, collaborator.password)){
        return res.status(401).send({
          success: false,
          error: "Collaborator/Password invalid",
        });
      };

      collaborator.password = undefined;
      const token = jwt.sign(
        {
          id: collaborator.id
        },
        jwtSecret,
        {
          expiresIn: '1d',
        }
      );

      return res.send({
        collaborator,
        token
      });

    } catch (error) {
      console.log(error)
      return res.json({
        success: false,
        error,
      });
    };
  },

  async changePassword(req, res){

    try{
      const { cpf, password, newPassword } = req.body;
      const collaborator = await Collaborators.findOne({ cpf }).select('+password');

      if(!collaborator || !password){
        return res.status(401).send({
          success: false,
          error: "Collaborator/Password invalid",
        });
      };

      if(!await bcrypt.compare(password, collaborator.password)){
        return res.status(401).send({
          success: false,
          error: "Collaborator/Password invalid",
        });
      };

      const hash = await bcrypt.hash(newPassword, 10);
      const collaborator2 = await Collaborators.findOneAndUpdate({ cpf }, { password: hash });

      return res.send({
        success: true,
        message: "Password changed",
        collaborator2,
        token: jwt.sign({ id: collaborator2._id }, jwtSecret, { expiresIn: '1d' }),
      });

    } catch (error) {
      console.log(error)
      return res.json({
        success: false,
        error,
      });
    };

  },

  async me (req, res) {
    const { userId } = req;

    try{
      const user = await Collaborators.findById(userId);
  
      if(!user) throw new Error('Collaborator not found');
  
      res.status(200).json({
        success: true,
        user
      });

    } catch(err){
      res.status(400).json({
        success: false,
        message: err
      });
    };
  },

  forgotPassword: async (req, res) => {
    try{
      const { email } = req.body;

      if(!email) return res.json({
        success: false,
        error: 'Email is required'
      });

      const collaborator = await Collaborators.findOne({ email });

      if(!collaborator) return res.json({
        success: false,
        error: 'Email não cadastrado'
      });

      const token = crypto.randomBytes(5).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await Collaborators.findByIdAndUpdate(collaborator._id, {
        '$set': {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      });

      return mailer.sendMail({
        to: email,
        from: 'francasantos323@gmail.com',
        template: 'auth/forgot_password',
        context: { token }
      }, (err) => {
        if(err) return res.json({
          success: false,
          error: 'Error sending email'
        });

        return res.json({
          success: true,
          message: 'Email sent'
        });
      });

    }catch(err){
      console.log(err);
        return res.json({
            success: false,
            error: err
        });
    };
  },

  resetPassword: async (req, res) => {
    try{
      const { email, token, password } = req.body;

      if(!email || !token || !password) return res.json({
        success: false,
        error: 'Email, token and password are required'
      });

      const collaborator = await Collaborators.findOne({ email }).select('+passwordResetToken passwordResetExpires');

      if(!collaborator) return res.json({
        success: false,
        error: 'User not found'
      });

      if(token !== collaborator.passwordResetToken) return res.json({
        success: false,
        error: 'Token invalid'
      });

      const now = new Date();

      if(now > collaborator.passwordResetExpires) return res.json({
        success: false,
        error: 'Token expired, generate a new one'
      });

      const hash = await bcrypt.hash(password, 10);

      const collaboratorUpdated = await Collaborators.findOneAndUpdate({ email }, {
        password: hash,
        passwordResetToken: undefined,
        passwordResetExpires: undefined
      }, { new: true });

      return res.json({
        success: true,
        message: 'Password changed',
        collaboratorUpdated
      });

    }catch(err){
      console.log(err);
        return res.json({
            success: false,
            error: err
        });
    };
  }
};