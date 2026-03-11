const SkeletonCard = () => {
    return (
        <div className="h-[480px] bg-slate-100 animate-pulse rounded-2xl border border-slate-200">
            <div className="h-64 bg-slate-200 rounded-t-2xl"></div>
            <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
        </div>

    );
}
export default SkeletonCard;