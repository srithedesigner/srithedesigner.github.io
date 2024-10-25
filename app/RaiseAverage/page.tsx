'use client'

import { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, increment } from 'firebase/database';
import { ref, update, onValue } from 'firebase/database';
import Image from 'next/image'
import { X } from 'lucide-react'




export default function AnnualRaiseCalculator() {
  const firebaseConfig = {
        apiKey: "AIzaSyBL8ZD3V-Pq2WFVl02jD_VjGhpE71Pzpxs",
        authDomain: "raise-average.firebaseapp.com",
        projectId: "raise-average",
        storageBucket: "raise-average.appspot.com",
        messagingSenderId: "927961867147",
        appId: "1:927961867147:web:5d311c2dd6efef5ea3858e",
        measurementId: "G-B25H82B1XR"
      };
      
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const totalSumRef = ref(database, 'total_sum');
  const totalNumberRef = ref(database, 'total_number');

  const [average, setAverage] = useState(0)
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [validation, setValidation] = useState(false)




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const intValue = parseInt(inputValue)
    if (intValue < 0 || intValue > 30) {
        setValidation(true)
        setShowPopup(true)
        setInputValue('')
        return
    }
    const newValue = parseFloat(inputValue)
    
    if (!isNaN(newValue)) {

      update(totalSumRef, {value: increment(newValue)}).then(() => {
        console.log('Updated count')
      });

      update(totalNumberRef, {value: increment(1)}).then(() => {
        console.log('Updated count')
      });

      setValidation(false)
      setShowPopup(true);
      setInputValue('')
    }
  }

  useEffect(() => {

    onValue(totalNumberRef, (snapshot) => {
      const data = snapshot.val();
      console.log("VAISHNAV COUNT", data?.value)
      setCount(data?.value ||  0); 
    });

  }, []);

  useEffect(() => {
  onValue(totalSumRef, (snapshot) => {
    const data = snapshot.val();
    const data_float = parseFloat(data?.value || 0);
    console.log("VAISHNAV", data_float)
    
    if (count != 0) {
        const roundedAverage = Math.round((data_float / count) * 100) / 100;
        setAverage(roundedAverage);
    }
    console.log("VAISHNAV AVERAGE", average, count)

  });

}, [count]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-300 p-4">
      <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6">
        <h1 className="text-4xl font-bold mb-6 text-center uppercase">Annual Raise Calculator</h1>
        <div className="text-8xl font-bold text-center mb-8 bg-gray-900 text-white p-4 border-4 border-black">
          {average}%
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Enter your raise %"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full text-2xl p-4 border-4 border-black focus:outline-none focus:ring-4 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-6 border-4 border-black transition-transform hover:translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0"
          >
            Submit
          </button>
        </form>
        <p className="mt-4 text-center text-lg">
          Total submissions: <span className="font-bold">{count}</span>
        </p>
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
            <Image alt = "thomas shelby cigarette gif" src={validation ? "images/mirz.jpeg" : "images/thank.jpeg"} width={300} height={300}></Image>
            <p className="text-xl font-bold mt-4"> { validation ? "BKL sahi number bataa" : "Thank you for your contribution"}</p>
          </div>
        </div>
      )}
    </div>
  )
}