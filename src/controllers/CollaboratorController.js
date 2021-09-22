const Collaborators = require('../models/Collaborators');
const Companies = require('../models/Companies');
const verifyCpf = require('../utils/verifyCpf');

const bcrypt = require('bcrypt');

module.exports = {
  read: async (req, res) => {
    try{
      const { id } = req.params;

      if(id){
        const collaborator = await Collaborators.findOne({ _id: id });

        return res.json({
          success: true,
          collaborator
        });
      }
      else{
        const collaborators = await Collaborators.find();

        return res.json({
            success: true,
            collaborators
        });
      }
    }catch(err){
        res.json({
            success: false,
            error: err
        });
    };
  },

  create: async (req, res) => {
    try{
      const { password } = req.body;

      if(req.body.company === 'none') return res.json({
        success: false,
        error: 'Company is required'
      });

      if(!password) return res.json({
        success: false,
        error: 'Password is required'
      });

      if(verifyCpf(req.body.cpf)) return res.json({
        success: false,
        error: 'CPF is invalid'
      });
      
      if(req.body.cpf && await Collaborators.findOne({ cpf: req.body.cpf })) return res.json({
        success: false,
        error: 'CPF já cadastrado'
      });

      req.body.password = await bcrypt.hash(password, 10);

      const collaborator = await Collaborators.create(req.body);
      const company = await Companies.findByIdAndUpdate(req.body.company, { $push: { collaborators: collaborator._id } }, { new: true });

      return res.json({
        success: true,
        collaborator
      });
    }catch(err){
      console.log(err)
        res.json({
            success: false,
            error: err
        });
    };

  },

  update: async (req, res) => {
    try{
        const { id } = req.params;

        if(!id) return res.json({
            success: false,
            error: 'ID is required'
        });

        if(verifyCpf(req.body.cpf)) return res.json({
          success: false,
          error: 'CPF is invalid'
        });

        const collaborator = await Collaborators.findByIdAndUpdate(id, req.body, { new: false });
        const company = await Companies.findByIdAndUpdate(collaborator.company, { $pull: { collaborators: collaborator._id } }, { new: true });
        const company2 = await Companies.findByIdAndUpdate(req.body.company, { $push: { collaborators: collaborator._id } }, { new: true });

        return res.json({
          success: true,
          collaborator
        });
    }catch(err){
        return res.json({
            success: false,
            error: err
        });
    };

  },

  delete: async (req, res) => {
    try{
      const { id } = req.params;

      await Collaborators.findOneAndRemove({ _id: id });

      return res.json({
        success: true
      });

    }catch(err){
        res.json({
            success: false,
            error: err
        });
    };

  },

  registerPoint: async (req, res) => {
    try{
      const { date, hours, type, collaboratorId } = req.body;
      
      if( !date || !hours || !type || !collaboratorId) return res.json({
        success: false,
        error: 'Parâmetros inválidos'
      });

      const collaborator2 = await Collaborators.findOne({_id: collaboratorId});

      const collaborator = await Collaborators.findByIdAndUpdate(collaboratorId, {
        $push: {
          points: {
            collaboratorName: collaborator2.name,
            collaboratorId: collaborator2._id,
            date,
            hours,
            type
          }
        }
      }, { new: true });

      return res.json({
        success: true,
        collaborator
      });
    } catch(err){
        return res.json({
            success: false,
            error: err
        });
    };

  },

  editPoint: async (req, res) => {
    try{
      const { id } = req.params;
      const { _id, date, hours, type } = req.body;

      if( !date || !hours || !type || !id || !_id) return res.json({
        success: false,
        error: 'Parâmetros inválidos'
      });

      const collaborator = await Collaborators.findByIdAndUpdate(id, {
        $set: {
          'points.$[i].date': date,
          'points.$[i].hours': hours,
          'points.$[i].type': type
        }

      }, {
        arrayFilters: [{ 'i._id': _id }],
        new: true
      });

      return res.json({
        success: true,
        collaborator
      });
    } catch(err){
      console.log(err)
        return res.json({
            success: false,
            error: err
        });
    };

  },

  deletePoint: async (req, res) => {

    try{
      const { id } = req.params;
      const { _id } = req.body;

      if( !_id || !id) return res.json({
        success: false,
        error: 'Parâmetros inválidos'
      });

      const collaborator = await Collaborators.findByIdAndUpdate(id, {
        $pull: {
          points: {
            _id: _id
          }
        }
      }, {
        new: true
      });

      return res.json({
        success: true,
        collaborator
      });
    } catch(err){
        return res.json({
            success: false,
            error: err
        });
    };
  },
};