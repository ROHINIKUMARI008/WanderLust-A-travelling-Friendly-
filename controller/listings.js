const Listing = require("../models/listing.js")

module.exports.index = (async(req,res,next)=>{
    let allListing = await Listing.find();
    console.log(allListing);
    res.render("listings/index.ejs",{allListing});});

    module.exports.newRender =  (req,res)=>{ 
        res.render("listings/new.ejs");
    }

    module.exports.newlisting =( async(req,res,next)=>{  
        let url =req.file.path;
        let filename =req.file.filename;
        
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;  
        newListing.image = {url, filename};   
        await newListing.save();
        
        req.flash("success","new listings created" );
        res.redirect("/listings");
    });
    
    module.exports.readlisting = async(req,res,next)=>{
        let { id } = req.params;                      //use urlencoded app.set-----
        const listing = await Listing.findById(id).populate({
            path :"reviews",
            populate: {
                path :  "author" }, })
        .populate("owner");
        
    
        if(!listing){ 
            req.flash("error","Listing you requested for does not exist!")
            res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show.ejs",{listing});
    };

    module.exports.editListings = async(req,res,next)=>{
        let {id} = req.params;
        
        let listing = await Listing.findById(id);
        if(!listing){
            res.redirect("/listings")
        }
        let orgImgUrl = listing.image.url;
        orgImgUrl = orgImgUrl.replace("/upload" ,"/upload/w_250");
        res.render("listings/edit.ejs",{listing,orgImgUrl});
    };

    module.exports.updateListings = async(req,res,next)=>{
   
        // if(!req.body.listing){                      
        //     throw new ExpressError(400,"Send valid data for listing")
        // }

    //   if(typeof(req.file) != "undefined"){
    //   let url =req.file.path;
    //   let filename =req.file.ilename;

    //   listing.image ={url, filename};   
    //   await listing.save();

    //   }
    let {id} = req.params;
        await Listing.findByIdAndUpdate((id) , { ...req.body.listing });
        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    }
    module.exports.destroyListings = async(req,res)=>{
       try{
            let { id } = req.params;
            let deletedListing =await Listing.findByIdAndDelete(id);
             console.log(deletedListing);
            console.log("delete");
            req.flash("success", "Listing deleted");
       }catch(err){
        console.log(err);
        res.redirect("/listings")  
       }
        
       };
        
        
    