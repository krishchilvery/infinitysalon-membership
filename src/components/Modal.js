import React from "react";
import { Dialog } from "@headlessui/react";

export default function Modal(props) {
  var closable = true
  if(props.closable !== undefined){
    closable = props.closable
  }
  return (
    <Dialog
      as="div"
      className={"fixed inset-0 z-10 overflow-y-auto"}
      onClose={props.handleClose}
      open={props.open}
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay
          className={
            "fixed inset-0 bg-black opacity-40 filter blur pointer-events-none"
          }
        />
        <span
          className=" inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className={
            "inline-block p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 dark:text-gray-50 shadow-xl rounded-2xl " +
            props.widthClass
          }
        >
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            {props.title}
          </Dialog.Title>
          {props.children}
          {closable ? (
            <div onClick={props.handleClose} className="flex absolute right-2 top-2 w-5 h-5 font-semibold cursor-pointer bg-red-600 hover:bg-red-300 rounded-full text-center justify-center items-center shadow"></div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Dialog>
  );
}
