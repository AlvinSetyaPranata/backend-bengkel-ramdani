// import { useAtom } from "jotai";
import { FormEvent, PropsWithChildren } from "react";
// import { selectedItemAtom } from "../../atoms/components/datatable";
import Button from "../ui/button/Button";

interface BaseModalProps extends PropsWithChildren {
  title: string;
  state: boolean;
  onClose: () => void;
}

function BaseModal({ title, state, onClose, children }: BaseModalProps) {
  // const [selectedItem,] = useAtom(selectedItemAtom);

  return (
    <div
      className={`fixed w-full min-h-screen z-999999 inset-0 ${
        state ? "block" : "hidden"
      }`}
    >
      <div className="relative top-0 left-0 w-full h-full flex justify-center items-center">
        {/* backdrop */}
        <div className="absolute inset-0 bg-slate-500/10 w-ful -z-10 backdrop-blur-sm"></div>
        {/* backdrop */}

        <div className="bg-white dark:bg-black dark:text-white rounded-md space-y-6 w-max max-w-[800px]">
          <div className="w-full flex justify-between items-center min-w-[300px] px-6 py-6">
            {/* heading  */}
            <h2 className="font-semibold text-xl">{title}</h2>
            <button onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* heading  */}
          {children}
        </div>
      </div>
    </div>
  );
}

interface ModalWithMessegeProps extends Omit<BaseModalProps, "children"> {
  messege: string;
  onCancel?: () => void;
  onOk?: () => void;
}

export function ModalWithMessege({
  title,
  messege,
  onClose,
  state,
}: ModalWithMessegeProps) {
  return (
    <BaseModal title={title} state={state} onClose={onClose}>
      <div className="px-6 py-4 space-y-12">
        <p>{messege}</p>
        <div className="flex justify-end w-full gap-x-2">
          <Button
            onClick={onClose}
            className="bg-red-500 text-white rounded-md font-medium px-4 py-2 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="bg-blue-500 text-white rounded-md font-medium px-4 py-2 text-sm"
          >
            Ok
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}


interface ModalWithConfirmationProps<TResponse, TVariables> 
  extends Omit<BaseModalProps, "children" | "onClose"> {
  mutation: { mutateAsync: (data: TVariables) => Promise<TResponse>; isPending?: boolean };
  id: TVariables;
  message: string; // Fixed typo
  onCancel: () => void;
}

export function ModalWithConfirmation<TResponse, TVariables>({
  title,
  message, // Fixed typo
  onCancel,
  mutation,
  id,
  state,
}: ModalWithConfirmationProps<TResponse, TVariables>) {

  const okHandler = async () => {
    try {
      await mutation.mutateAsync(id); 
      onCancel();

      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Mutation failed:", error);
    }
  };

  return (
    <BaseModal title={title} state={state} onClose={onCancel}>
      <div className="px-6 py-4 space-y-12">
        <p className="text-slate-400">{message}</p> {/* Fixed typo */}
        <div className="flex justify-end w-full gap-x-2">
          <Button
            onClick={onCancel}
            className="bg-red-500 text-white rounded-md font-medium px-4 py-2 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={okHandler}
            className="bg-blue-500 text-white rounded-md font-medium px-4 py-2 text-sm"
            disabled={mutation.isPending} // Prevent duplicate requests
          >
            {mutation.isPending ? "Processing..." : "Ok"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}


interface ModalWithFormProps extends BaseModalProps {
  mutation: MutateFunction<any, unknown, Record<string, any>, unknown>;
  method: "UPDATE"|"CREATE";
  onCancel?: () => void;
  onOk?: () => void;
  selectedInstance?: unknown
}

export function ModalWithForm({
  title,
  mutation,
  method,
  onClose,
  state,
  children,
  selectedInstance
}: ModalWithFormProps) {

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget);

   const res = Object.fromEntries(formData.entries())

   if (method == "UPDATE") {
     await mutation({data: res, id: selectedInstance.id})
    } else {
      await mutation(res)
    }

    onClose()
    setTimeout(() => window.location.reload(), 3000)

  }

  return (
    <BaseModal title={title} state={state} onClose={onClose}>
      <div className="px-6 py-4 space-y-12">
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10" onSubmit={onFormSubmit}>
          {children}
          <div className="flex justify-end w-full gap-x-2 col-span-2">
            <Button
              className="bg-red-500 text-white rounded-md font-medium px-4 py-2 text-sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-500 text-white rounded-md font-medium px-4 py-2 text-sm"
              type="submit"
            >
              Ok
            </Button>
          </div>
        </form>

      </div>
    </BaseModal>
  );
}
