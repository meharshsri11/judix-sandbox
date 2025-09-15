import { ReactNode } from "react"

export const DropdownOptionsComponent = ({ children, onClickItem = () => { } }: { children: ReactNode, onClickItem?: () => void }) => {
    return (

        <div className='px-4 py-2 font-medium text-label-md tracking-[4%] leading-[130%] text-neutral-600 hover:bg-neutral-100 rounded-md cursor-pointer'
            onClick={onClickItem}
        >
            {children}
        </div>
    )
}