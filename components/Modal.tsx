"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import { useRef } from "react";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";

function Modal() {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [addTask, image, setImage, newTaskInput, setNewTaskInput, newTaskType] =
    useBoardStore((state) => [
      state.addTask,
      state.image,
      state.setImage,
      state.newTaskInput,
      state.setNewTaskInput,
      state.newTaskType,
    ]);
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;
    //add task
    addTask(newTaskInput, newTaskType, image);
    setImage(null);
    closeModal();
  };

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        onSubmit={handleSubmit}
        as="form"
        onClose={closeModal}
        className="relative z-10"
      >
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25"></div>
            </Transition.Child>
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left p-6 align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 pb-2"
              >
                Add a task{" "}
              </Dialog.Title>

              {/* add task input */}
              <div className="mt-2">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Add a task here :)"
                  className="w-full outline-none p-5 border border-gray-300 rounded-md"
                />
              </div>

              {/* select task type */}
              <TaskTypeRadioGroup />

              {/* upload img */}

              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => imagePickerRef.current?.click()}
                  className="w-full border border-gray-200 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <PhotoIcon className="h-6 w-6 mr-2 inline" />
                  Upload Image
                </button>
                {image && (
                  <Image
                    alt="uploaded_image"
                    src={URL.createObjectURL(image)}
                    width={200}
                    height={200}
                    className="w-full object-cover mt-2 h-44 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                    onClick={() => setImage(null)}
                  />
                )}
                <input
                  type="file"
                  ref={imagePickerRef}
                  hidden
                  onChange={(e) => {
                    //check if file is an image
                    if (!e.target.files![0].type.startsWith("image/")) return;
                    setImage(e.target.files![0]);
                  }}
                />
              </div>

              {/* add task btn */}
              <div className="mt-4 mx-auto">
                <button
                  type="submit"
                  disabled={!newTaskInput}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  Add Task
                </button>
              </div>
            </Dialog.Panel>
            {/*  */}
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
