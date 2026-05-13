import React from 'react'

const LoginForm = () => {
  return (
    <>
      <div className="w-[48%] bg-[#348A91] flex flex-col relative overflow-hidden items-start justify-center gap-8 px-[48px] py-[56px]">
        <div className=" flex items-center gap-[12px] z-10">
          <div className="w-[42px] h-[42px] rounded-[12px] bg-[#ffffff33]  flex items-center justify-center">
            <svg viewBox="0 0 24 24" className='h-[22px] w-[22px] fill-white'>
              <path  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <div className="font-[600] text-[20px] text-white">
            MediQ <span className='opacity-[0.7] font-[400]'>AI</span>
          </div>
        </div>

        <div className="hero-copy">
          <h1>
            Clinical intelligence,
            <br />
            <em className='opacity-25'>always verified.</em>
          </h1>
          <p>
            Ask complex pharmaceutical and medical questions. Every answer
            traces back to your institution's uploaded, verified knowledge base.
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginForm