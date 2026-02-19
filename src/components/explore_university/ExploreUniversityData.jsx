"use client";

import React, { useState, useEffect } from 'react'
import ExploreMainPage from "./ExploreMainPage"
import { useAuth } from '../../context/AuthProvider'
import { useRouter } from 'next/navigation'
import { getRouteState, ROUTE_STATE_KEYS } from '../../lib/routeState'


const ExploreUniversityData = () => {

    const router = useRouter()
    const [undata, setunData] = useState([])
    const { currentUser } = useAuth()
    const [img, setImg] = useState("")

    useEffect(() => {
        const payload = getRouteState(ROUTE_STATE_KEYS.exploreUniversity)
        if (payload?.udata) {
            setunData([payload.udata])
            setImg(payload.url)
        } else {
            router.replace('/explore')
        }
    }, [router])

    const navigateLogin = () => {
        if (currentUser)
            router.push('/dashboard/applications')
        else
            window.location.href = 'https://app.coursefinder.ai/student-platform/777d47d0/login'
    }

    return (
        <>
            <div className='max-w-5xl mx-auto bg-transparent px-5 p-10 rounded my-5'>
                {undata && undata.map((data) => {
                    return (
                        <div className='grid grid-cols-3 gap-4 sm:grid-cols-5'>
                            {/* <div className='col-span-1 sm:col-span-1'> */}
                            <img src={img} alt={"Not Available"} className="mt-4 col-span-1 sm:col-span-1 h-20 rounded-md sm:h-40" />
                            {/* </div> */}
                            <div className='col-span-2 sm:col-span-3 self-center'>
                                <div className='flex flex-col flex-wrap'>
                                    <label className='text font-bold text-1.9lr'>{data.Name}</label>
                                    <div className='flex flex-col justify-left sm:flex-col'>
                                        <div className='flex flex-row items-center text-main font-bold text-1.3lr'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-circle-fill mx-1" viewBox="0 0 16 16"> <circle cx="8" cy="8" r="8" /> </svg>
                                            {data.University}
                                        </div>
                                        <div className='flex flex-row items-center text-main'>
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
                                            {data.Country}
                                        </div>


                                    </div>
                                    {/* <div className='flex flex-row items-center text'>
                                        <svg
                                            aria-hidden="true"
                                            className="w-4 h-4 text-main mt-1"
                                            fill="none"
                                            stroke="black"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path fill-rule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z" /> <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
                                        </svg>
                                        <label className='text-bold text-main font-bold text-2xs'>{data.acceptance_rate}</label> <label className='text text-2xs sm:ml-2'>Acceptance Rate</label>
                                    </div> */}
                                </div>
                            </div>

                            <div className='col-span-2 sm:col-span-1 self-center'>
                                <a href={data.admission_url} target="_blank" className='cursor-pointer'>
                                    <button
                                        type="submit"
                                        className="block text-white w-full text-1.5lr bg-main py-1 px-4 rounded-lg"
                                        onClick={navigateLogin}
                                    >
                                        Apply Now
                                    </button></a>
                            </div>

                        </div>
                    )
                })}
                <ExploreMainPage props={undata} />
            </div>
        </>
    )
}

export default ExploreUniversityData