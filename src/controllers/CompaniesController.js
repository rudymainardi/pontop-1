const Companies = require('../models/Companies');
const verifyCnpj = require('../utils/verifyCnpj');

module.exports = {
  read: async (req, res) => {
    try{
      const { id } = req.params;

      if(id){
        const company = await Companies.findOne({ _id: id });

        return res.json({
          success: true,
          company
        });
      }
      else{
        const companies = await Companies.find();

        return res.json({
            success: true,
            companies
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
      if(req.body.password)
        req.body.password = undefined;
      
      if(req.body.cnpj && await Companies.findOne({ cnpj: req.body.cnpj })) return res.json({
        success: false,
        error: 'CNPJ já cadastrado'
      });


      if(verifyCnpj(req.body.cnpj)) return res.json({
        success: false,
        error: 'CNPJ inválido'
      });
      
      const company = await Companies.create(req.body);

      return res.json({
        success: true,
        company
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

        if(verifyCnpj(req.body.cnpj)) return res.json({
          success: false,
          error: 'CNPJ inválido'
        });

        const company = await Companies.findByIdAndUpdate(id, req.body, { new: true });

        return res.json({
          success: true,
          company
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

      await Companies.findOneAndRemove({ _id: id });

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
      const { date, hours, type, companyId } = req.body;
      
      if( !date || !hours || !type || !companyId) return res.json({
        success: false,
        error: 'Parâmetros inválidos'
      });

      const company = await Companies.findByIdAndUpdate(companyId, {
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
        company
      });
    } catch(err){
        return res.json({
            success: false,
            error: err
        });
    };

  },
};