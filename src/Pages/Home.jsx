import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import { useForm } from "react-hook-form";
import { emailRegex } from "../Constants/index.constant";
import APIManager from "../utils/ApiManager";
import toast from "react-hot-toast";


const ApiManager = new APIManager();

function Home() {

    const navbarRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);    
    const  { reset,register,formState:{ errors },handleSubmit } = useForm({ defaultValues:{
        name:"",
        email:"",
        subject:"",
        message:"",
    } });

    const onSubmit =  async (data) => {    
        console.log("this is form data : ",data);
        try {
            const resData = await  ApiManager.post("admin/inquiry",data);
            if(!resData.error){
                reset({});
                toast.success("Your Inquiry has been submitted successfully");
            } else {
                toast.error("Something went wrong"); 
            }
        } catch (error) {
            toast.error("Something went wrong"); 
        }
    }
    const handleNavigation = (e) => {
     
    const position = Math.ceil(e.target.documentElement.scrollTop);

    if (position > 45) {
        setScrolled(true);
    } else {
        setScrolled(false);
    }
    }

    useEffect(()=>{
        window.addEventListener("scroll", (e) => handleNavigation(e));
       
        return () => {
            window.removeEventListener("scroll", () => {});
        }
    },[])

  return (
    <div data-bs-spy="scroll" data-bs-target=".navbar" data-bs-offset="51">

      <div class="bg-white p-0">
        {/* Spinner Start  */}
        {/* <div
          id="spinner"
          className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
          <div
            className="spinner-grow text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div> */}

        {/* Navbar & Hero End */}
        <div className="position-relative p-0" id="home">
          <nav ref={navbarRef} className={`navbar ${ scrolled  && 'sticky-top shadow-sm' } navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0`}>
            <a href="" className="navbar-brand p-0">
              <h1 className="m-0">eAarogyam</h1>
              {/* <img src="img/logo.png" alt="Logo"> */}
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse">
              <span className="fa fa-bars"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav mx-auto py-0">
                <a href="#home" className="nav-item nav-link active">
                  Home
                </a>
                <a href="#about" className="nav-item nav-link">
                  About
                </a>
                <a href="#feature" className="nav-item nav-link">
                  Feature
                </a>
                <a href="#contact" className="nav-item nav-link">
                  Contact
                </a>
              </div>
              <a
                href="/his"
                className="btn btn-primary-gradient rounded-pill py-2 px-4 ms-3 d-none d-lg-block">
                Start Free Trial
              </a>
            </div>
          </nav>

          <div className=" bg-primary hero-header">
            <div className="container px-lg-5">
              <div className="row g-5">
                <div className="col-lg-8 text-center text-lg-start">
                  <h1 className="text-white mb-4 animated slideInDown">
                    eAarogyam - Heath Care Managment Software
                  </h1>
                  <p className="text-white pb-3 animated slideInDown">
                    Simplifying Healthcare Information Management Software(HIMS)
                    with India's First Innovative SaaS-Based Software Solutions.
                  </p>
                  <a
                    href="#about"
                    className="btn btn-primary-gradient py-sm-3 px-4 px-sm-5 rounded-pill me-3 animated slideInLeft">
                    Read More
                  </a>
                  <a
                    href="#contact"
                    className="btn btn-secondary-gradient py-sm-3 px-4 px-sm-5 rounded-pill animated slideInRight">
                    Contact Us
                  </a>
                </div>
                <div
                  className="col-lg-4 d-flex justify-content-center justify-content-lg-end wow fadeInUp"
                  data-wow-delay="0.3s">
                  <div className="owl-carousel screenshot-carousel">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

         {/* About Start */}
         <div className=" py-5" id="about">
    <div className="container py-5 px-lg-5">
        <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                <h5 className="text-primary-gradient fw-medium">About App</h5>
                <h1 className="mb-4">#1 SaaS base Medical Software for Hospital</h1>
                <p className="mb-4">Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit clita duo justo eirmod magna dolore erat amet</p>
                <div className="row g-4 mb-4">
                    {/* <div className="col-sm-6 wow fadeIn" data-wow-delay="0.5s">
                        <div className="d-flex">
                            <i className="fa fa-cogs fa-2x text-primary-gradient flex-shrink-0 mt-1"></i>
                            <div className="ms-3">
                                <h2 className="mb-0" data-toggle="counter-up">1234</h2>
                                <p className="text-primary-gradient mb-0">Active Install</p>
                            </div>
                        </div>
                    </div> */}
                    <div className="col-sm-6 wow fadeIn" data-wow-delay="0.7s">
                        {/* <div className="d-flex">
                            <i className="fa fa-comments fa-2x text-secondary-gradient flex-shrink-0 mt-1"></i>
                            <div className="ms-3">
                                <h2 className="mb-0" data-toggle="counter-up">1234</h2>
                                <p className="text-secondary-gradient mb-0">Clients Reviews</p>
                            </div>
                        </div> */}
                    </div>
                </div>
                <a href="" className="btn btn-primary-gradient py-sm-3 px-4 px-sm-5 rounded-pill mt-3">Read More</a>
            </div>
            <div className="col-lg-6">
            </div>
        </div>
    </div>
        </div>

        {/* Feature Start */}
        <div className="container-xxl py-5" id="feature">
        <div div className="container py-5 px-lg-5">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="text-primary-gradient fw-medium">Software Features</h5>
            <h1 className="mb-5">Awesome Features</h1>
        </div>
        <div className="row g-4">
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                <div className="feature-item bg-light rounded p-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary-gradient rounded-circle mb-4" style={{ width: '60px', height: '60px' }}>
                        <i className="fa fa-eye text-white fs-4"></i>
                    </div>
                    <h5 className="mb-3">User Management</h5>
                    <p className="m-0">Add and manage staff users with different roles.
                        Efficiently assign roles and permissions for enhanced security and access control.</p>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                <div className="feature-item bg-light rounded p-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-secondary-gradient rounded-circle mb-4" style={{ width: '60px', height: '60px' }}>
                        <i className="fa fa-layer-group text-white fs-4"></i>
                    </div>
                    <h5 className="mb-3">Hospital Branch Management</h5>
                    <p className="m-0">Centralized management of multiple hospital branches.
                        Streamline operations by organizing and coordinating activities across all branches.</p>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                <div className="feature-item bg-light rounded p-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary-gradient rounded-circle mb-4" style={{ width: '60px', height: '60px' }}>
                        <i className="fa fa-edit text-white fs-4"></i>
                    </div>
                    <h5 className="mb-3">Live Appointment Management</h5>
                    <p className="m-0">Seamlessly schedule and manage appointments for patients.
                        Ensure efficient utilization of doctor's time and resources.</p>
                </div>
            </div>
            {/* ... */}
        </div>
    </div>
        </div>

        {/* Screenshot Start */}
        <div className=" py-5">
    <div className="container py-5 px-lg-5">
        <div className="row g-5 align-items-center">
            <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
                <h5 className="text-primary-gradient fw-medium">eAarogyam</h5>
                <h1 className="mb-4">User Friendly interface And Very Easy To Use eAarogyam Software</h1>
                <p className="mb-4">Experience the epitome of simplicity and efficiency with eAarogyam - our intuitive, user-friendly interface makes navigating our SaaS-based software a breeze. Say goodbye to complexity and hello to streamlined operations with eAarogyam, where ease of use is our top priority.</p>
                <p><i className="fa fa-check text-primary-gradient me-3"></i>Centralized Data Management</p>
                <p><i className="fa fa-check text-primary-gradient me-3"></i>Scalability and Flexibility</p>
                <p className="mb-4"><i className="fa fa-check text-primary-gradient me-3"></i>Real-Time Updates and Accessibility</p>
                <a href="" className="btn btn-primary-gradient py-sm-3 px-4 px-sm-5 rounded-pill mt-3">Read More</a>
            </div>
            <div className="col-lg-4 d-flex justify-content-center justify-content-lg-end wow fadeInUp" data-wow-delay="0.3s">
                <div className="owl-carousel screenshot-carousel">
                    
                </div>
            </div>
        </div>
    </div>
        </div>

        {/* Process Start */}
        <div className="container-xxl py-5">
    <div className="container py-5 px-lg-5">
        <div className="text-center pb-4 wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="text-primary-gradient fw-medium">How It Works</h5>
            <h1 className="mb-5">3 Easy Steps</h1>
        </div>
        <div className="row gy-5 gx-4 justify-content-center">
            <div className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp" data-wow-delay="0.1s">
                <div className="position-relative bg-light rounded pt-5 pb-4 px-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary-gradient rounded-circle position-absolute top-0 start-50 translate-middle shadow" style={{ width: '100px', height: '100px' }}>
                        <i className="fa fa-cog fa-3x text-white"></i>
                    </div>
                    <h5 className="mt-4 mb-3">Search eAarogyam</h5>
                    <p className="mb-0">Search eAarogyam for SaaS Base Hospital Management Solutions</p>
                </div>
            </div>
            <div className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp" data-wow-delay="0.3s">
                <div className="position-relative bg-light rounded pt-5 pb-4 px-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-secondary-gradient rounded-circle position-absolute top-0 start-50 translate-middle shadow" style={{ width: '100px', height: '100px' }}>
                        <i className="fa fa-address-card fa-3x text-white"></i>
                    </div>
                    <h5 className="mt-4 mb-3">Start With Free Demo</h5>
                    <p className="mb-0">Initiate your journey with a complimentary demo.</p>
                </div>
            </div>
            <div className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp" data-wow-delay="0.5s">
                <div className="position-relative bg-light rounded pt-5 pb-4 px-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary-gradient rounded-circle position-absolute top-0 start-50 translate-middle shadow" style={{ width: '100px', height: '100px' }}>
                        <i className="fa fa-check fa-3x text-white"></i>
                    </div>
                    <h5 className="mt-4 mb-3">Enjoy The Features</h5>
                    <p className="mb-0">Savor a smooth experience with our comprehensive SaaS platform.</p>
                </div>
            </div>
        </div>
    </div>
        </div>              

        {/* Contact Start */}
        <div className="container-xxl py-5" id="contact">
    <div className="container py-5 px-lg-5">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="text-primary-gradient fw-medium">Contact Us</h5>
            <h1 className="mb-5">Get In Touch!</h1>
        </div>
        <div className="row justify-content-center">
            <div className="col-lg-9">
                <div className="wow fadeInUp" data-wow-delay="0.3s">
                    <p className="text-center mb-4">
                        Feel free to reach out to us for any inquiries or assistance regarding our innovative Hospital Information Management System (HIMS) software. Our dedicated team is here to support you on your journey towards streamlined healthcare management</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input type="text" className="form-control" id="name" placeholder="Your Name" {...register("name",{ required:{ value:true,mess
                                    :"Name is required" } })} />
                                    <label htmlFor="name">Your Name</label> 
                                </div>
                                {
                                    errors.name && <small className="text-danger">{errors.name.message}</small>
                                }
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input type="email" className="form-control" id="email" placeholder="Your Email" {...register("email",{ required:{ value:true,mess
                                    :"Name is required" }, pattern:{ value:emailRegex,message:"Plase enter valid email" } })} />
                                    <label htmlFor="email">Your Email</label>
                                </div>
                                {
                                    errors.email && <small className="text-danger">{errors.email.message}</small>
                                }
                            </div>

                            <div className="col-12">
                                <div className="form-floating">
                                    <input type="text" className="form-control" id="subject" placeholder="Subject" {...register("subject",{ required:{ value:true,mess
                                    :"please enter subject" } })}/>
                                    <label htmlFor="subject">Subject</label>
                                </div>
                                {
                                    errors.subject && <small className="text-danger">{errors.subject.message}</small>
                                }
                            </div>
                            <div className="col-12">
                                <div className="form-floating">
                                    <textarea className="form-control" placeholder="Leave a message here" id="message" style={{ height: '150px' }} {...register("message",{ required:{ value:true,mess
                                    :"Please enter some message for us!" } })}></textarea>
                                    <label htmlFor="message">Message</label>
                                </div>
                                {
                                    errors.message && <small className="text-danger">{errors.message.message}</small>
                                }
                            </div>
                            <div className="col-12 text-center">
                                <button className="btn btn-primary-gradient rounded-pill py-3 px-5" type="submit">Send Message</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
        </div>

        {/* Footer Start */}
        <div className="container-fluid bg-primary text-light footer wow fadeIn" data-wow-delay="0.1s">
    <div className="container py-5 px-lg-5">
        <div className="row g-5">
            <div className="col-md-6 col-lg-3">
                <h4 className="text-white mb-4">Address</h4>
                <p><i className="fa fa-map-marker-alt me-3"></i>617,Ganesh Glory, SG Highway Gota, Ahmedabad 382470</p>
                <p><i className="fa fa-phone-alt me-3"></i>+91 9913204659</p>
                <p><i className="fa fa-envelope me-3"></i>eaarogyam.ahmedabad@gmail.com</p>
                <div className="d-flex pt-2">
                    <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-twitter"></i></a>
                    <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-facebook-f"></i></a>
                    <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-instagram"></i></a>
                    <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-linkedin-in"></i></a>
                </div>
            </div>
            <div className="col-md-6 col-lg-3">
                <h4 className="text-white mb-4">Quick Link</h4>
                <a className="btn btn-link" href="">About Us</a>
                <a className="btn btn-link" href="">Contact Us</a>
                <a className="btn btn-link" href="">Privacy Policy</a>
                <a className="btn btn-link" href="">Terms & Condition</a>
                <a className="btn btn-link" href="">Career</a>
            </div>
            <div className="col-md-6 col-lg-3">
                <h4 className="text-white mb-4">Newsletter</h4>
                <p>eAarogyam is a leading provider of Hospital Information System (HIS) solutions, offering a comprehensive and user-friendly platform designed to streamline hospital operations and improve patient care</p>
                <div className="position-relative w-100 mt-3">
                    <input className="form-control border-0 rounded-pill w-100 ps-4 pe-5" type="text" placeholder="Your Email" style={{ height: '48px' }} />
                    <button type="button" className="btn shadow-none position-absolute top-0 end-0 mt-1 me-2"><i className="fa fa-paper-plane text-primary-gradient fs-4"></i></button>
                </div>
            </div>
        </div>
    </div>
    <div className="container px-lg-5">
        <div className="copyright">
            <div className="row">
                <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                    &copy; <a className="border-bottom" href="#">Your Site Name</a>, All Right Reserved.
                    <a className="border-bottom" href="https://eaarogyam.com">eAarogyam</a>
                </div>
                <div className="col-md-6 text-center text-md-end">
                    <div className="footer-menu">
                        <a href="#home">Home</a>
                        <a href="#about">About US</a>
                        <a href="#feature">Features</a>
                        <a href="#contact">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
        </div>

        {/* Back to Top */}
        <a href="#" class="btn btn-lg btn-lg-square back-to-top pt-2"><i class="bi bi-arrow-up text-white"></i></a>        
      </div>
    </div>
  );
}

export default Home;
