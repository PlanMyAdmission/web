"use client";

import React from 'react'
import app from '../../../../firebase';
import {
    Firestore,
    getFirestore,
    doc,
    collection,
    onSnapshot,
    getDocs,
    limit,
    query,
    where
} from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthProvider';
import { useRouter } from 'next/navigation';
import { setRouteState, ROUTE_STATE_KEYS } from '../../../../lib/routeState';

const Universities = ({ props }) => {
    const [courses, setcourses] = useState([]);
    const [univ, setUniv] = useState([]);
    const [uniqueUniv, setUniqueUniv] = useState([])
    const [filterCourse, setFilterCourse] = useState([])
    const [rest, setRest] = useState(false);
    const [n, setN] = useState(10)
    const [showElement, setShowElement] = useState(true)
    const db = getFirestore(app);
    const router = useRouter();
    const { currentUser, updateFavorite, profileData } = useAuth()
    const [loading, setLoading] = useState(false)
    const fetchCourses = async () => {
        // e.preventDefault();
        const dataref = query(collection(db, "university_info"), where("country", "==", props.country), where("state", "==", props.state), where("degree", "array-contains", props.degree), limit(200));
        const docSnap = await getDocs(dataref);
        docSnap.forEach(doc => {
            setcourses((prev) => {
                return [...prev, doc.data()]
            })
        })
    }

    const handleFavorite = (e) => {
        let value = e.target.value
        // let isInArray =
        //     profileData?.favorites?.find(function (el) {
        //         return el.id === value;
        //     }) !== undefined;
        // console.log(isInArray);
        // if (!isInArray) {
        console.log("shortlisting.......");
        updateFavorite(value);
        setLoading(false);
        // } else {
        //     alert("Document already exists please delete first one");
        //     return;
        // }

        // if (!localStorage.getItem("shortlisted").includes(e.target.value)) {
        //     localStorage.setItem("shortlisted", [localStorage.getItem("shortlisted"), e.target.value])
        //     setLoading(false)
        // }
        // else {
        //     alert("Item already shorlisted")
        //     setLoading(false)
        // }

    };

    const fetchUniversity = async () => {
        // e.preventDefault();
        const dataref = query(collection(db, "university_desc"), where("slug", "in", uniqueUniv));
        console.log(dataref)
        const docSnap = await getDocs(dataref);
        docSnap.forEach(doc => {
            setUniv((prev) => {
                return [...prev, doc.data()]
            })
            console.log("Hello")
        })
        //console.log(univ)
    }
    useEffect(() => {
        setN(10)
        setUniqueUniv([]);
        setUniv([]);
        setcourses([]);
        setFilterCourse([])
        // fetchUniversity();
        fetchCourses();
        console.log(props)
        console.log(currentUser)
        localStorage.removeItem("shortlisted")
        localStorage.setItem("shortlisted", [])
        setTimeout(function () {
            setShowElement(false)
        }, 8000);
    }, [rest])
    useEffect(() => {
        console.log(courses);
        //console.log(univ);
        const arr = courses.map(item => item.school_slug).filter((value, index, self) => self.indexOf(value) === index)
        // const tempC = courses.map(item => item.discipline).filter((value, index, self) => self.indexOf(value) === index)
        // setUniqueCourse(tempC)
        courses.filter(arr => {
            if (arr.discipline[0] === props.discipline)
                setFilterCourse((prev) => {
                    return [...prev, arr]
                })
        })
        setUniqueUniv(arr)
    }, [courses])

    useEffect(() => {
        if (uniqueUniv.length != 0) {
            fetchUniversity()
            // console.log("Hello")
        }
    }, [uniqueUniv])
    useEffect(() => {
        console.log(uniqueUniv)
        // console.log(uniqueCourse)

        // if (univ.length > 0) {
        //     univ = Array.from(new Set(univ).map(JSON.parse))
        // }
        console.log(univ)
    }, [univ])
    let img = "";
    let university = "";
    let fee = 0
    let curr = ""
    let accept = 0
    let rank = 0
    let duration = 0

    const handleEnroll = (payload) => {
        setRouteState(ROUTE_STATE_KEYS.universityDetails, {
            udata: payload,
        });
        router.push('/dashboard/university');
    };

    return (
        <>
            {!loading ? <div className="flex flex-col items-center">
                <div className="max-w-6xl mx-auto bg-light px-5 py-2 rounded mb-5 mt-4">
                    <label className='text-main'>You found {/*<label className='font-bold'>{uniqueUniv.length}</label> institutes and */}<label className='font-bold'>{filterCourse.length}</label> courses</label>
                </div>
                <div className='max-w-6xl mx-auto bg-light px-5 py-3 rounded mb-5 '>
                    {filterCourse && filterCourse.length > 0 ? filterCourse.slice(0, n).map((data) => {
                        let univdata = univ.filter(obj => {
                            return obj.slug === data.school_slug
                        })

                        univdata.map((udata) => {
                            img = udata.logo
                            university = udata.name
                            fee = udata.tuition_value
                            curr = udata.tuition_currency
                            accept = udata.acceptance_rate
                            rank = udata.ranks_isc_global_max
                        })

                        return (
                            <div
                                key={data?.id}
                                className="grid grid-cols-2 gap-4 sm:grid-cols-7 items-center bg-white m-2 rounded-lg py-2 px-5 ring-main ring-1 ring-offset-1 my-5"
                            >
                                <img src={img} alt={""} className="col-span-1 sm:col-span-1 h-10 rounded-md sm:h-20" />
                                <div className='col-span-2 sm:col-span-5'>
                                    <h1 className="text-lr font-bold px-5">{data?.degree} in {data?.name}</h1>
                                    <ul className="text-2xs px-5 mt-3">
                                        <li className="text-main flex flex-row items-center">
                                            <svg
                                                aria-hidden="true"
                                                className="w-3 h-3 text-main"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1"
                                                    d="M18,4.48a8.45,8.45,0,0,0-12,12l5.27,5.28a1,1,0,0,0,1.42,0L18,16.43A8.45,8.45,0,0,0,18,4.48ZM16.57,15,12,19.59,7.43,15a6.46,6.46,0,1,1,9.14,0ZM9,7.41a4.32,4.32,0,0,0,0,6.1,4.31,4.31,0,0,0,7.36-3,4.24,4.24,0,0,0-1.26-3.05A4.3,4.3,0,0,0,9,7.41Zm4.69,4.68a2.33,2.33,0,1,1,.67-1.63A2.33,2.33,0,0,1,13.64,12.09Z"
                                                ></path>
                                            </svg>
                                            {`${data?.state}, ${data?.country}`}
                                        </li>
                                        <li className="mt-1"><label className='text font-bold'>University: </label>{university}</li>
                                        {/* <li className=""><label className='text font-bold'>Duration: </label>{duration}</li> */}
                                        <li className=""><label className='text font-bold'>Yearly Tuition Fee: </label>{curr} {fee}</li>
                                        <li className="flex flex-row items-center flex-wrap ">
                                            <svg
                                                aria-hidden="true"
                                                className="w-4 h-4 text-main mt-1"
                                                fill="none"
                                                stroke="black"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                {/* <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1"
                                                            d="M18,4.48a8.45,8.45,0,0,0-12,12l5.27,5.28a1,1,0,0,0,1.42,0L18,16.43A8.45,8.45,0,0,0,18,4.48ZM16.57,15,12,19.59,7.43,15a6.46,6.46,0,1,1,9.14,0ZM9,7.41a4.32,4.32,0,0,0,0,6.1,4.31,4.31,0,0,0,7.36-3,4.24,4.24,0,0,0-1.26-3.05A4.3,4.3,0,0,0,9,7.41Zm4.69,4.68a2.33,2.33,0,1,1,.67-1.63A2.33,2.33,0,0,1,13.64,12.09Z"
                                                        ></path> */}
                                                <path fill-rule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z" /> <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
                                            </svg>
                                            <label className='text-bold text-main font-bold text-2xs'>{accept}%</label> <label className='text text-2.5xs sm:ml-2'>Acceptance Rate</label>
                                            {/* <svg
                                                aria-hidden="true"
                                                className="w-3 h-3 text-main text-bold ml-5"
                                                fill="none"
                                                stroke="black"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path fill-rule="nonzero" d="M12 7a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 1.5l1.323 2.68 2.957.43-2.14 2.085.505 2.946L12 17.25l-2.645 1.39.505-2.945-2.14-2.086 2.957-.43L12 10.5zM18 2v3l-1.363 1.138A9.935 9.935 0 0 0 13 5.049L13 2 18 2zm-7-.001v3.05a9.935 9.935 0 0 0-3.636 1.088L6 5V2l5-.001z" />
                                            </svg><label className='text-bold text-main font-bold text-2xs'>{rank}</label> <label className='text text-2.5xs ml-2'>ISC Rank</label> */}
                                        </li>
                                    </ul>
                                </div>
                                <div className='col-span-2 sm:col-span-1 flex flex-col justify-between'>
                                    <div className='mb-10 top-0'><label className='text text-sm mx-1'>Shortlist</label>
                                        <input type="checkbox"
                                            className='mt-2 ml-2'
                                            value={data.id}
                                            onChange={(e) => {
                                                setLoading(true)
                                                handleFavorite(e)
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="block text-main w-full uppercase bg-transparent p-1 font-bold text-lg mb-0 mt-5"
                                        onClick={() => handleEnroll(univdata)}
                                    >
                                        Enroll
                                    </button>
                                </div>
                            </div>
                        );
                    }) : showElement ? <div role="status" class="flex align-items-center justify-center ">
                        <svg aria-hidden="true" class="w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 text-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div> : <div>No Results Found...</div>}
                </div>
                <div className="mb-10">
                    <button
                        type="submit"
                        className="block text-white bg-main text-1.5lr p-3 text-lg mb-0 mt-5 items-center rounded-lg self-center"
                        onClick={() => {
                            setN(n + 10)
                        }
                        }
                    >
                        Show More
                    </button>
                </div>
            </div> : <div>Shorlisting...</div>}



        </>
    )
}


export default Universities