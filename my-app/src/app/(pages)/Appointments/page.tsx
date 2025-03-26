'use client'

import Navbar from "@/app/components/navbar/Navbar";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Footer from "@/app/components/footer/Footer";
// import Star from "@/app/components/stars/Stars";
// import Button from "@/app/components/button/Button";
import Doctorcard from "@/app/components/doctorCard/Doctorcard";
import { useRouter } from "next/navigation";
import Pagenation from '@/app/components/pagenation/Pagenation'

interface Doctor {
    name: string;
    degree: string;
    specialty: string;
    experience: number;
    rating: number;
    // img_url: string;
    photo: string;
    id:string;
    gender:string;
}

interface Pagenation{
    currentPage: number
    totalPages : number
    onPageChange: (page: number) => void;
}

export default function app(){
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    // const [doctorsSlice, setDoctorsSlice] = useState<Doctor[]>([])
    // const [doctorSearch, setDoctorsSearch]=useState<Doctor[]>([]);
    const [ratingDropDown, setRatingDropDown] = useState(true)
    const [expDropDown, setexpDropDown] = useState(true)
    const [genderDropDown, setGenderDropDown] = useState(true)
    const [search , setsearch]=useState('')
    const [cardVisible, setcarVisible]=useState(false)
    const[AllDocNum, setAllDocNum] = useState<string | number>('')

    // const decimals = Array.from({ length: 51 }, (_, i) => parseFloat((0 + i * 0.1).toFixed(1)));
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    
    // const expArr = Array.from({ length: 50 }, (_, i) => 0 + i+1);
    // console.log(expArr)
    const [experienceFilter, setExperienceFilter] = useState<string | null>(null);
    const [genderFilter, setGenderFilter] = useState<number | null>(null);


    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.floor(Number(AllDocNum) / 6);
    // const [data, setData] = useState<string[]>([]);

    // useEffect(() => {
    //     fetchData(currentPage);
    // }, [currentPage]);

    // const fetchData = async (page: number) => {
    //     console.log(`Fetching data for page ${page}...`);
    //     // Simulating API call
    //     // setTimeout(() => {
    //     // setData([`Item ${(page - 1) * 10 + 1}`, `Item ${(page - 1) * 10 + 2}`, `Item ${(page - 1) * 10 + 3}`]);
    //     // }, 500);
        
    // };

    // const doctorsPerPage = 6;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
        console.log('page' + page)
        // setDoctorsSlice(doctors.slice(page+6-2, (page+6-1)+6))
    };

    // const handlePagePrev = (page: number) => {
    //     if (page >= 1) {
    //         setCurrentPage(page);
    //     }
    //     console.log('page' + page)
    //     // setDoctorsSlice(doctors.slice(page+6-2, (page+6-1)+6))
    // };

    useEffect(() => {
        async function fetching() {
            // const fetchData: Doctor[] = await (await fetch("http://localhost:8080/api/doctors/top")).json();
            const fetchData= await (await fetch(`http://localhost:8080/api/doctors/top?page=${currentPage}&rating=${ratingFilter}&experience=${experienceFilter}&gender=${genderFilter}`)).json();
            const res1 = await(await fetch('http://localhost:8080/api/doctors/getAllDoc')).json()
            console.log(fetchData.doctors)
            setDoctors(fetchData.doctors);
            setAllDocNum(res1.doctors)
            // if doctors state use kiya hota toh due to async behaviour doctors ka length 0 hi hota
        }
        fetching();
    }, [currentPage, ratingFilter, experienceFilter, genderFilter]);
    
    useEffect(()=>{

        if(doctors.length!=0) {
            console.log(doctors.length)
            setcarVisible(true)
        } 
        // setDoctorsSlice(doctors.slice(0, 6))
    }, [doctors])

    let routes=useRouter()

    function handleDoctorSearchInp(e:any){
        setsearch(e.target.value)
    }

    function handleSerchClick(){
        // name, specialty, experience, rating, degree
        async function fetching() {
            const fetchData= await (await fetch(`http://localhost:8080/api/doctors/search?search=${search}`)).json();
            console.log(fetchData.doctors)
            setDoctors(fetchData.doctors);
            if(fetchData.doctors!=0) {
                console.log(doctors.length)
                setcarVisible(true)
            }
        }
        fetching();     
    }

    // console.log(doctors.id)

    function handleReset(){
        // setRatingFilter(decimals)
        // setExperienceFilter(expArr)
        setGenderFilter(null)
        setExperienceFilter(null)
        setRatingFilter(null)
    }
    // console.log(doctors)
    return(
        <>
            <Navbar/>

            <div className={styles.section}>

                <header className={styles.headerContainer}>
                    <p className={styles.headerpara}><strong>Find a doctor at your own ease</strong></p>
                    <div className={styles.inputContainer}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Search doctors" onChange={(e)=>handleDoctorSearchInp(e)}/>
                        <button onClick={handleSerchClick}>Search</button>
                    </div>
                </header>

                <main className={styles.mainContainer}>
                    <div className={styles.mainheader}>
                        <h1>{AllDocNum} doctors available</h1>
                        <p>Book appointments with minimum wait-time & verified doctor details</p>
                    </div>

                    <div className={styles.container}>
                        <aside className={styles.aside}>
                            <div className={styles.asidefstDiv}>
                                <p><strong>Filter By:</strong></p>
                                <p onClick={handleReset}
                                ><strong>Reset</strong></p>
                            </div>
                            <div className={styles.filterContainer}>

                                <div className={`${styles.rating}`}>
                                    <label>Rating</label>
                                    <div className={styles.filterhead}>
                                        <label>Rating</label>
                                        <span onClick={()=>setRatingDropDown(!ratingDropDown)}><i className="fa-solid fa-caret-down"></i></span>
                                    </div>
                                    <div className={`${ratingDropDown ? styles.showInp : ""} ${styles.filtermain}`}>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={handleReset} name='option'/>
                                            <label>show all</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const decimal = Array.from({ length: 10 }, (_, i) => 1 + i * 0.1);
                                                // console.log(decimal);
                                                
                                                setRatingFilter(1)
                                                console.log(ratingFilter)
                                            }} name='option' value={1}/>
                                            <label>1 star</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const decimal = Array.from({ length: 10 }, (_, i) => 2 + i * 0.1);
                                                // console.log(decimal);
                                                
                                                setRatingFilter(2)
                                                console.log(ratingFilter)
                                            }} name='option' value={2}/>
                                            <label>2 star</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const decimal = Array.from({ length: 10 }, (_, i) => 3 + i * 0.1);
                                                // console.log(decimal);
                                                
                                                setRatingFilter(3)
                                                console.log(ratingFilter)
                                            }} name='option' value={3}/>
                                            <label>3 star</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const decimal = Array.from({ length: 10 }, (_, i) => 4 + i * 0.1);
                                                // console.log(decimal);
                                                
                                                setRatingFilter(4)
                                                console.log(ratingFilter)
                                            }} name='option' value={4}/>
                                            <label>4 star</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const decimal = Array.from({ length: 10 }, (_, i) => 5 + i * 0.1);
                                                // console.log(decimal);
                                                
                                                setRatingFilter(5)
                                                console.log(ratingFilter)
                                            }} name='option' value={5}/>
                                            <label>5 star</label>
                                        </div>
                                    </div>

                                </div>
                                <div className={styles.experience}>
                                    <label>Experience</label>
                                    <div className={styles.filterhead}>
                                        <label>Experience</label>
                                        <span onClick={()=>setexpDropDown(!expDropDown)}><i className="fa-solid fa-caret-down"></i></span>
                                    </div>
                                    <div className={`${expDropDown ? styles.showInp : ""} ${styles.filtermain}`}>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                const expArr = Array.from({ length: 50 }, (_, i) => 15 + i+1);
                                                setExperienceFilter('15+')
                                            }} name='option1'/>
                                            <label>15+ years</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const expArr = [10,11,12,13,14,14]
                                                setExperienceFilter('10-15')
                                            }} name='option1'/>
                                            <label>10-15 years</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const expArr = [5,6,7,8,9]
                                                setExperienceFilter('5-10')
                                            }} name='option1'/>
                                            <label>5-10 years</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const expArr = [3,4]
                                                setExperienceFilter('3-5')
                                            }} name='option1'/>
                                            <label>3-5 years</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const expArr = [1,2]
                                                setExperienceFilter('1-3')
                                            }} name='option1'/>
                                            <label>1-3 years</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const expArr = [0,1]
                                                setExperienceFilter('0-1')
                                            }} name='option1'/>
                                            <label>0-1 years</label>
                                        </div>
                                    </div>

                                </div>
                                <div className={styles.gender}>
                                    <label>Gender</label>
                                    <div className={styles.filterhead}>
                                        <label>Gender</label>
                                        <span onClick={()=>setGenderDropDown(!genderDropDown)}><i className="fa-solid fa-caret-down"></i></span>
                                    </div>
                                    <div className={`${genderDropDown ? styles.showInp : ""} ${styles.filtermain}`}>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                setGenderFilter(genderFilter)
                                            }} name='option2'/>
                                            <label>show all</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const genderArr = 'male';
                                                setGenderFilter(1)
                                            }} name='option2'/>
                                            <label>Male</label>
                                        </div>

                                        <div className={styles.radioInp}>
                                            <input type="radio" onChange={()=>{
                                                // const genderArr = 'female';
                                                setGenderFilter(2)
                                            }} name='option2'/>
                                            <label>Female</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* ye grid banega */}
                        <div className={`${cardVisible ? styles.doctorCard : ''}`}>

                            {doctors.length != 0 ? (
                                    doctors.map((doctor, index) => (
                                        // ratingFilter.includes(doctor.rating)  &&
                                        // experienceFilter.includes(doctor.experience) &&
                                        // genderFilter.includes(doctor.gender?.toLowerCase()) &&
                                        ( 
                                            <div key={index} className={`${styles[`doctor${index + 1}`]}`}>
                                                <Doctorcard 
                                                    name={doctor.name} 
                                                    degree={doctor.degree} 
                                                    speciality={doctor.specialty} 
                                                    img_url={doctor.photo} 
                                                    rating={doctor.rating} 
                                                    experience={doctor.experience} 
                                                    buttonFunctionality={() => {
                                                        console.log('doctor id '+doctor.id)
                                                        routes.push(`/Appointments/${doctor.id}`)
                                                    }}
                                                />
                                            </div>
                                        )
                                    ))) 
                                : (<div className={styles.noData}>
                                    <img src='https://img.freepik.com/premium-vector/no-data-found-empty-file-folder-concept-design-vector-illustration_620585-1698.jpg?semt=ais_hybrid'/>
                                    </div>
                                )

                            }
                        </div>

                    </div>
                    
                    {doctors.length!=0 ? (<Pagenation page={currentPage} handlePageChange={handlePageChange}  totalPages={totalPages}/>) : ('')}
                </main>
            </div>

            <Footer/>
        </>
    )
}