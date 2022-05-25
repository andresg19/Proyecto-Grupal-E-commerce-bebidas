const { Router } = require('express');
const axios = require ('axios')
const jwt = require("jsonwebtoken")

const {Producto, Usuario}= require ('../db')
const router = Router();


// router.use('./bebidas' , bebidas)

///////////////////////////////////////////////////////////////////////////////////

const getDataBase = async()=>{
    return await Producto.findAll() 
}
router.get('/bebidasApi', async (req, res, next) => {
    
    try { 
     const bebidasInfo = await axios.get(`https://bebidas-efc61-default-rtdb.firebaseio.com/results.json`)   
     const allBebidas = await bebidasInfo.data.map(e => { return e })
     const allBebidasDb = await allBebidas.map(e => {Producto.create(e)})
   
      res.json(allBebidas)
    } catch (error) {
       next(error)
    } 
  });



  router.get('/bebidas', async (req, res, next) => {
     try {
         
      const {nombre} = req.query
    const dataInfo = await getDataBase()
    if(nombre){
        const dataName = await dataInfo.filter(e=> e.nombre.toLowerCase().includes(nombre.toLowerCase()))
        if(!dataName.length){
            return res.status(400).send('No se encontro ese producto')
        }
        res.json(dataName)
    }else{
        res.json(dataInfo)
    }

      } catch (error) {
         next(error)
     }
  })



  router.get('/bebida/:id', async (req, res) => {
     let { id } = req.params

     try{
         let bebida = await Producto.findByPk(id)
         res.status(200).json(bebida)
         
      }catch(err){
         res.status(404)
   }
  })

  
  router.post('/bebida',  async (req, res) => {
    let  ={ 
        nombre,imagen,marca,ml,graduacion,descripcion,precio,stock
    }= req.body

    let [bebidaCreada, created] = await Producto.findOrCreate({
        where:{ 
            nombre:nombre,
            imagen:imagen,
            marca:marca,
            descripcion:descripcion,
            ml: ml,
            graduacion:graduacion,
            precio: precio,
            stock:stock
        }     
    })
    res.json(bebidaCreada)
  })



  router.put('/bebida',  async (req, res) => {
    let {nombre,imagen,marca,ml,graduacion,descripcion,precio,stock}= req.body
    let {id} = req.body


    try{
        const bebidaPut= await Producto.findOne({where:{id:id}})
        
        
         await bebidaPut.update({
                id:id,
                nombre:nombre,
                imagen:imagen,
                marca:marca,
                descripcion:descripcion,
                ml: ml,
                graduacion:graduacion,
                precio: precio,
                stock:stock           
        })
        res.json(bebidaPut)
    }catch(err){
        console.log('error del glorioso catch. Amen')
    }
  })


  
  router.post('/usuario',  async (req, res) => {
    let  ={ 
        nombre,email,contraseña,nacimiento,direccion,telefono
    }= req.body


    let [usuarioCreado, created] = await Usuario.findOrCreate({
        where:{ 
            nombre:nombre,
            email:email,
            contraseña: contraseña,
            nacimiento:nacimiento,
            direccion: direccion,
            telefono :telefono,
        }    
       
    })
    res.json(usuarioCreado)
  })

  router.post('/usuario/login',  async (req, res) => {
      const user ={
          id,nombre,email
      }=req.body

      jwt.sign({user},'secretkey',(err,token)=>{
          res.json({token})
      })

  })

  router.delete('/bebida/:id', async(req, res) => {
    const {id} = req.params;
  
    const del = await Producto.destroy({
        where:{
            id: id
        }
    })
    return res.status(200).send('AL LOBBY');
  })
  
  // FALTA GET DE USUARIO PARA PROBAR DELETE
  // router.delete('/usuario/:id', async(req, res) => {
  //   const {id} = req.params;
  
  //   const del = await Usuario.destroy({
  //       where:{
  //           id: id
  //       }
  //   })
  //   return res.status(200).send('AL LOBBY');
  // })

  router.put('/usuario', async (req, res) => {

    let { nombre, email, contraseña , nacimiento , direccion , telefono } = req.body
    let { id } = req.body


      try {
          const usuarioPut = await Usuario.findOne({ where: { id: id } })


          await usuarioPut.update({
              id: id,
              nombre: nombre,
              email: email,
              contraseña: contraseña ,
              nacimiento: nacimiento,
              direccion: direccion,
              telefono: telefono
          })
          res.json(usuarioPut)
      } catch (err) {
          console.log('error usuarios')
      }
  })


module.exports = router;

