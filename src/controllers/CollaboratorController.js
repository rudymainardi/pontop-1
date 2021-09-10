const Collaborators = require('../models/Collaborators');
const Companies = require('../models/Companies');

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
      if(req.body.company === 'none') return res.json({
        success: false,
        error: 'Company is required'
      });
      
      
      if(req.body.cpf && await Collaborators.findOne({ cpf: req.body.cpf })) return res.json({
        success: false,
        error: 'CPF já cadastrado'
      });
      
      const collaborator = await Collaborators.create(req.body);
      const company = await Collaborators.findByIdAndUpdate(req.body.company, { $push: { collaborators: collaborator._id } }, { new: true });

      return res.json({
        success: true,
        collaborator
      });
    }catch(err){
        res.json({
            success: false,
            error: err
        });
    };

  },

  update: async (req, res) => {
    try{
        const { id } = req.params;

        const collaborator = await Collaborators.findByIdAndUpdate(id, req.body, { new: true });

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

      const collaborator = await Collaborators.findByIdAndUpdate(collaboratorId, {
        $push: {
          points: {
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
};