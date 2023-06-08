"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";

function Modal() {
  const [newTaskInput, setNewTaskInput] = useBoardStore((state) => [
    state.newTaskInput,
    state.setNewTaskInput,
  ]);
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="form" onClose={closeModal} className="relative z-10">
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
            </Dialog.Panel>
            {/*  */}
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
