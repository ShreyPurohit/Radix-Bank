import { ITransactonComponentProps } from "@/lib/interfaces"

const TransactionComponent: React.FC<ITransactonComponentProps> = ({ currentPage, handleLimitChange, handlePageNext, handlePagePrevious, totalPages, currLimit }) => {
    return (
        <>
            <button
                disabled={+(currentPage) === 1}
                className="px-3 py-2 bg-slate-200 disabled:bg-gray-500"
                onClick={handlePagePrevious}
            >
                Back
            </button>
            <button
                disabled={+(currentPage) === totalPages}
                className="px-3 py-2 bg-slate-200 disabled:bg-gray-500"
                onClick={handlePageNext}
            >
                Next
            </button>
            <select className='w-max' onChange={handleLimitChange} value={currLimit}>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={8}>8</option>
            </select>
        </>
    )
}

export default TransactionComponent