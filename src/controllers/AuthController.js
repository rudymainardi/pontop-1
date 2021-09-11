const Collaborators = require('../models/Collaborators');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
  }
};