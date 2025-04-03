"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Linkedin, Github, Instagram, X } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const companies = [
  { name: 'Cisco', logo: 'images/cisco.svg' },
  { name: 'Botminds.ai', logo: 'images/botminds.svg' },
  { name: 'BNY Mellon', logo: '/images/bny.svg' },
]

const experiences = {
  'Cisco': ['Developed and deployed a llama3 based LLM with Cisco internal data for creating a virtual techlead using LoRA',
            'Engaged in low-level C programming for operating system development and automated L2 triage using Python.'],

  'Botminds.ai': ['Developed and implemented prompt engineering techniques to enhance the performance of large language models (LLMs) such as GPT-3.5 and GPT-4.',
    'Worked extensively with AngularJS, C#, and Python to build robust and scalable applications.',
    'Utilized Milvus and Qdrant vector databases to optimize search and retrieval operations for efficient data management.'],
  'BNY Mellon': [
    'Developed a Maven Plugin to identify discrepancies in foreign key indices between Java Hibernate models and the',
    'The plugin improved query performance for deleting a specific Hibernate model by 215%',
    'Gained hands-on experience with CI/CD pipelines, Airflow, Git, Spring Boot, databases, and Core Java.'
  ]
}

const projects = [
  { name: 'Project A', description: 'Carpooling Android Application' },
  { name: 'Project B', description: 'Google Chrome extension that prevents procrastination on youtube' },
  
]

const gymStats = [
  { name: 'Bench Press PR', value: '75KG' },
  { name: 'Bicep Curls PR', value: '30KG' },
  { name: 'Squat PR', value: 'NA' },
  { name: 'Deadlift PR', value: 'NA' },
]
const runStats = [
    { name: '5K Time', value: '25 minutes' },
    { name: '10K Time', value: '1 Hour 20 Min' },
    { name: 'Half Marathon Time', value: 'NA' },
    { name: 'Marathon Time', value: 'NA' },
]

export default function EnhancedPortfolio() {
  const [selectedCompany, setSelectedCompany] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [popupYes, setPopupYes] = useState(false)
  const [age, setAge] = useState(0)

  useEffect(() => {
    const birthDate = new Date('2001-02-07') 
    const today = new Date()
    const ageInMilliseconds = today.getTime() - birthDate.getTime()
    const ageInYears = ageInMilliseconds / (365 * 24 * 60 * 60 * 1000)
    setAge(ageInYears)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPopup(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])


  const handleCompanyClick = (company: string) => {
    setSelectedCompany(company)
  }

  const handlePrettyClick = (isPretty: boolean) => {
    setPopupYes(isPretty)
    setShowPopup(true)
  }

  return (
    <div className="min-h-screen bg-yellow-200 p-8 font-mono">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="border-4 border-black p-4 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-4 border-black mb-4">
            <Image src="/images/profile1.png" alt="Profile" width={300} height={300} className="w-full" />
          </div>
          <div className="flex justify-between mb-4">
            <button 
              className="border-2 border-black px-4 py-2 bg-white hover:bg-red-500 active:translate-y-1"
              onClick={() => handlePrettyClick(false)}
            >
              Ugly
            </button>
            <button 
                className="border-2 border-black px-4 py-2 bg-yellow-300 hover:bg-green-500 active:translate-y-1 shadow-right-bottom"
              onClick={() => handlePrettyClick(true)}
            >
              Very Pretty
            </button>
          </div>
          <div className="border-4 border-black p-4 mb-4">
            <h3 className="font-bold mb-2">Life Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 border-2 border-black">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(age / 100) * 100}%` }}></div>
            </div>
            <p className="text-sm">{age.toFixed(2)} years old</p>
          </div>
          <div className="border-4 border-black p-4">

            <h3 className="font-bold mb-2">Gym Stats</h3>
            <DotLottieReact
                src="animations/gym.lottie"
                className="w-25 h-25"
                loop
                autoplay
            />
            <ul>
              {gymStats.map((stat, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold">{stat.name}:</span> {stat.value}
                </li>
              ))}
            </ul>
          
          </div>
          <div className="border-4 border-black p-4">

            <h3 className="font-bold mb-2">Running Stats</h3>
            <DotLottieReact
                src="animations/running.lottie"
                className="w-25 h-25"
                loop
                autoplay
            />
            <ul>
              {runStats.map((stat, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold">{stat.name}:</span> {stat.value}
                </li>
              ))}
            </ul>
          
          </div>
        </div>

        {/* Middle Column */}
        <div className="md:col-span-2 border-4 border-black p-4 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className='flex'>
            <h1 className="text-6xl font-bold mb-4 p-2 bg-white inline-block">
                Sri Vaishnav
            </h1>
            <div className="flex space-x-4 mb-8 mt-8 pl-10">
                <a href="https://www.linkedin.com/in/sri-vaishnav/" className="text-4xl"><Linkedin /></a>
                <a href="https://github.com/srithedesigner" className="text-4xl"><Github /></a>
                <a href="https://www.instagram.com/sriyshnav/" className="text-4xl"><Instagram /></a>
            </div>
          </div>
            
          <div className="flex items-center mb-4">
          <DotLottieReact 
                src="animations/hi.lottie" 
                className="w-40 h-40"
                loop
                autoplay
            />
            <p className="text-xl ml-8" >
              Software engineer part-time,<br />
              perpetual learner full-time
            </p>
          </div>
          <Link 
            href="/blogs"
            className="inline-block border-4 border-black px-6 py-3 bg-yellow-300 hover:bg-yellow-400 active:translate-y-1 text-xl font-bold mb-4"
          >
            Read my Blog
          </Link>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b-4 border-black">Work Experience</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              {companies.map((company) => (
                <button
                  key={company.name}
                  className={`border-4 border-black p-4 hover:bg-gray-100 active:translate-y-1 transition-transform ${
                     selectedCompany === company.name ? 'translate-y-1' : ''
                  }`}
                  onClick={() => handleCompanyClick(company.name)}
                >
                  <Image src={company.logo} alt={company.name} width={50} height={25} className="w-full" />
                </button>

                
              ))}
            </div>
            
            {selectedCompany && (
              <div className="p-4 border-4 border-black bg-white">
                <h3 className="font-bold mb-2">{selectedCompany}</h3>
                <ul className='list-decimal p-6'>
                {
                    experiences[selectedCompany as keyof typeof experiences].map((exp, index) => (
                        <li key = {index} >{exp}</li>
                        ))
                }
                </ul>
              </div>
            )}
            {!selectedCompany && (
              <div className="p-4 border-4 border-black bg-white">
                <h3 className="font-bold mb-2">{selectedCompany}</h3>
                <Image alt='bramhanandam Julayi Gif' src='/images/bramhi.gif' width={300} height={300}></Image>
                <p> Click on the company to see what I did there!</p>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b-4 border-black">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <div key={index} className="border-4 border-black p-4 bg-white">
                  <h3 className="font-bold mb-2">{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black p-8 max-w-sm w-full relative">
            <button 
              className="absolute top-2 right-2 text-2xl"
              onClick={() => setShowPopup(false)}
            >
              <X />
            </button>
            <Image alt = "thomas shelby cigarette gif" src={popupYes?'/images/jatiratnalu.gif' : "/images/thomas.gif"} width={300} height={300}></Image>
            <p className="text-xl font-bold">{popupYes ? "Yaay correct answer!" : "No, your grandma ugly"}</p>
          </div>
        </div>
      )}
    </div>
  )
}
