import {
  FaFileDownload,
  FaGithub,
  FaLinkedinIn,
  FaRegClipboard,
  FaMailBulk,
} from "react-icons/fa";
import SectionDescription from "./sub-components/SectionDescription";
import SectionTitle from "./sub-components/SectionTitle";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const email = "emmanuelisenah@gmail.com";

  const displayToast = (message: string) => {
    toast(message, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      displayToast("📧 Copied E-mail!");
    } catch (e) {
      console.log("Failed to copy to clipboard: ", e);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
        displayToast("✅ Message sent");
        console.log(result.text);
        form.current?.reset();
      })
      .catch((error) => {
        console.log(error.text);
        form.current?.reset();
        throw error;
      });
  };
  return (
    <div>
      <div className="flex flex-col justify-center items-center text-center">
        <SectionTitle>Contact</SectionTitle>
        <SectionDescription style="bg-gradient-to-r from-blue-500 via-blue-400 to-sky-500 text-transparent bg-clip-text pb-2">
          Get in touch with me
          <br />
          whatever you prefer.
        </SectionDescription>
        <p className="text-sm md:text-normal text-neutral-600 dark:text-neutral-400 max-w-[280px] sm:max-w-3xl">
          Fill in the form on the left with your information and I will get back
          to you as soon as possible. Alternatively, you can find me on the
          platforms listed on the right.
        </p>
      </div>
      <div className="grid grid-cols-12 gap-6 mx-auto mt-14 lg:max-w-5xl">
        <div className="col-span-12 md:col-span-5 lg:col-span-4 order-last md:order-first">
          <div className="flex flex-col gap-6 ">
            <div className="h-fit p-8 bg-gradient-to-br from-blue-500 to-sky-400 text-white rounded-xl drop-shadow-[0_0_5px_rgba(0,0,0,0.25)]">
              <span className="font-semibold text-2xl tracking-tight">
                Socials
              </span>
              <div className="grid grid-cols-12 gap-3 mt-6 justify-center">
                <a
                  href="https://github.com/Armadillidiid" target={"_blank"}
                  rel={"noreferrer noopener"}
                  className="col-span-6 flex gap-2 items-center text-sm xl:text-base justify-center rounded-lg py-3 px-4 text-black hover:text-white hover:transition hover:duration-200 font-semibold bg-neutral-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700 active:scale-90"
                >
                  <FaGithub />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/emmanuel-isenah-541593190?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B8jozcR60TrSSNPHpHUNgQw%3D%3D"
                  target={"_blank"}
                  rel={"noreferrer noopener"}
                  className="col-span-6 flex text-sm xl:text-base gap-2 items-center justify-center rounded-lg py-2 px-4 text-black hover:text-white hover:transition hover:duration-200 font-semibold bg-neutral-100 hover:bg-gradient-to-r hover:from-sky-500 hover:to-sky-700 active:scale-90"
                >
                  <FaLinkedinIn />
                  Linkedin
                </a>
                <button
                  onClick={copyToClipboard}
                  className="col-span-12 justify-center text-sm xl:text-base flex gap-2 items-center rounded-lg py-3 px-4 text-black hover:text-white hover:transition hover:duration-200 font-semibold bg-neutral-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-sky-700 active:scale-90"
                >
                  <FaMailBulk />
                  Copy email
                </button>
              </div>
            </div>
            <div className="h-fit p-8 bg-gradient-to-br from-blue-500 to-sky-400 flex flex-col gap-4 bg-white rounded-xl drop-shadow-[0_0_5px_rgba(0,0,0,0.25)]">
              <span className="font-semibold text-white text-2xl tracking-tight">
                Resume
              </span>
              <p className="text-white leading-tight text-sm">
                You may also obtain a copy of my resume by clicking the download
                button below.
              </p>
              <a
                href="/resume.pdf"
                download
                className="self-center bg-white text-blue-500 hover:text-white hover:bg-blue-500 transition-all duration-200 ease-in-out flex items-center w-fit gap-2 py-3 px-6 rounded-xl text-sm xl:text-base font-semibold shadow-lg active:scale-90"
              >
                <FaFileDownload />
                Download CV
              </a>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-7 lg:col-span-8 h-fit bg-white dark:bg-[#0d0d0d] rounded-xl drop-shadow-[0_0_5px_rgba(0,0,0,0.25)]">
          <form
            onSubmit={(e) => sendEmail(e)}
            ref={form}
            className="flex flex-col gap-4 p-8"
            id="contact-form"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <input
                name="name"
                type="text"
                placeholder="Your name"
                className="w-full lg:w-1/2 contact-input"
              />
              <input
                name="email"
                type="text"
                placeholder="Your email address"
                className="w-full lg:w-1/2 contact-input"
              />
            </div>
            <input
              name="subject"
              type="text"
              placeholder="Subject"
              className="w-full contact-input"
            />
            <textarea
              name="messaage"
              id="message"
              placeholder="I'd like to inquire more about..."
              className="w-full h-[200px] lg:h-[264px] contact-textarea"
            ></textarea>
            <button className="blue-button text-white rounded p-2 text-sm font-medium">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-7 md:mt-14 py-8 gap-6 text-neutral-700 dark:text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 m-auto animate-bounce cursor-pointer transition duration-200"
          fill="none"
          stroke="currentColor"
          onClick={scrollToTop}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 11l7-7 7 7M5 19l7-7 7 7"
          ></path>
        </svg>
        <span className="text-xs">
          Designed and developed by Emmanuel Isenah ©2023
        </span>
      </div>
    </div>
  );
};

export default Contact;