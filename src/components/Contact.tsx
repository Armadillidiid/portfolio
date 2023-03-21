import Button from "./sub-components/Button";
import {
  FaFileDownload,
  FaGithub,
  FaLinkedinIn,
  FaRegClipboard,
} from "react-icons/fa";
import SectionDescription from "./sub-components/SectionDescription";
import SectionTitle from "./sub-components/SectionTitle";
import emailjs from "@emailjs/browser";
import { useRef } from "react";

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.current === null) return;

    return emailjs
      .sendForm(
        "service_yxh67lq",
        "template_egmalli",
        form.current,
        "f22cRsV4RnHdpwvEd"
      )
      .then((result) => {
        console.log(result.text);
        return result;
      })
      .catch((error) => {
        console.log(error.text);
        throw error;
      });
  };
  return (
    <div>
      <div className="flex flex-col justify-center items-center text-center">
        <SectionTitle>Contact</SectionTitle>
        <SectionDescription>
          Reach out to me <br /> any way you want.
        </SectionDescription>
        <p className="text-neutral-600 max-w-3xl">
          Fill in the form on the left with your information and I will get back
          to you as soon as possible. Alternatively, you can find me on the
          platforms listed on the right.
        </p>
      </div>
      <div className="grid grid-cols-12 gap-6 mx-auto mt-14 max-w-5xl">
        <div className="col-span-4 ">
          <div className="flex flex-col gap-6 ">
            <div className="h-fit p-8 bg-gradient-to-br from-blue-500 to-sky-400 text-white rounded-xl drop-shadow-[0_0_5px_rgba(0,0,0,0.25)]">
              <span className="font-semibold text-2xl tracking-tight">
                Socials
              </span>
              <div className="grid grid-cols-12 gap-3 mt-6">
                <button className="col-span-6 flex gap-2 items-center rounded-lg py-3 px-4 text-black hover:text-white hover:transition hover:duration-200 font-semibold bg-neutral-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700">
                  <FaGithub />
                  GitHub
                </button>
                <button className="col-span-6 flex gap-2 items-center rounded-lg py-2 px-4 text-black hover:text-white hover:transition hover:duration-200 font-semibold bg-neutral-100 hover:bg-gradient-to-r hover:from-sky-500 hover:to-sky-700">
                  <FaLinkedinIn />
                  Linkedin
                </button>
                <button className="col-span-12 justify-center flex gap-2 items-center rounded-lg py-3 px-4 text-black hover:text-white hover:transition hover:duration-200 font-semibold bg-neutral-100 hover:bg-gradient-to-r hover:from-teal-500 hover:to-teal-700">
                  <FaRegClipboard />
                  Copy email
                </button>
              </div>
            </div>
            <div className="h-fit p-8 bg-gradient-to-br from-blue-500 to-sky-400 flex flex-col gap-4 bg-white rounded-xl drop-shadow-[0_0_5px_rgba(0,0,0,0.25)]">
              <span className="font-semibold text-white text-2xl tracking-tight">
                Resume
              </span>
              <p className="text-white leading-tight">
                You may also obtain a copy of my resume by clicking the download
                button below.
              </p>
              <button className="self-center bg-white text-blue-500 hover:text-white hover:bg-blue-500 transition-colors duration-200 flex items-center w-fit gap-2 py-3 px-6 rounded-xl text-base font-semibold shadow-lg">
                <FaFileDownload />
                Download CV
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-8 h-fit bg-white rounded-xl drop-shadow-[0_0_5px_rgba(0,0,0,0.25)]">
          <form
            onSubmit={(e) => sendEmail(e)}
            ref={form}
            className="flex flex-col gap-4 p-8"
          >
            <div className="flex gap-4">
              <input
                name="name"
                type="text"
                placeholder="Your name"
                className="w-1/2 text-sm rounded py-2 px-3 text-neutral-600 bg-neutral-100 outline outline-2 outline-neutral-200/80 focus:outline-blue-500 focus:outline-2 focus:outline"
              />
              <input
                name="email"
                type="text"
                placeholder="Your email address"
                className="w-1/2 text-sm rounded py-2 px-3 text-neutral-600 bg-neutral-100 outline outline-2 outline-neutral-200/80 focus:outline-blue-500 focus:outline-2 focus:outline"
              />
            </div>
            <input
              name="subject"
              type="text"
              placeholder="Subject"
              className="w-full text-sm rounded py-2 px-3 text-neutral-600 bg-neutral-100 outline outline-2 outline-neutral-200/80 focus:outline-blue-500 focus:outline-2 focus:outline"
            />
            <textarea
              name="messaage"
              id="message"
              rows={13}
              placeholder="I'd like to inquire more about..."
              className="w-full text-sm rounded py-2 px-3 text-neutral-600 bg-neutral-100 outline outline-2 outline-neutral-200/80 focus:outline-blue-500 focus:outline-2 focus:outline"
            ></textarea>
            <button className="bg-blue-500 text-white rounded p-2 text-sm font-medium">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-14 py-8 gap-6 text-neutral-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 m-auto animate-bounce cursor-pointer transition duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 11l7-7 7 7M5 19l7-7 7 7"
          ></path>
        </svg>
        <span className="text-sm">
          Designed and developed by Emmanuel Isenah ©2023
        </span>
      </div>
    </div>
  );
};

export default Contact;
