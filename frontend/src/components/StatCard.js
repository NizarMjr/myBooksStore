const StatCard = ({ label, value, icon, color }) => {
    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-105">
            <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>{icon}</div>
            <div>
                <p className="text-slate-400 text-sm font-bold">{label}</p>
                <h3 className="text-2xl font-black text-slate-800">{value}</h3>
            </div>
        </div>
    )
}


export default StatCard;