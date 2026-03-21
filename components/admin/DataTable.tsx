interface DataTableProps<T> {
    columns: {
        header: string;
        accessorKey: keyof T;
        cell?: (item: T) => React.ReactNode;
    }[];
    data: T[];
    actions?: (item: T) => React.ReactNode;
}

export default function DataTable<T>({ columns, data, actions }: DataTableProps<T>) {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i} className="px-6 py-4 whitespace-nowrap">
                                    {col.header}
                                </th>
                            ))}
                            {actions && <th className="px-6 py-4 text-right">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-6 py-12 text-center text-slate-500"
                                >
                                    Tidak ada data.
                                </td>
                            </tr>
                        ) : (
                            data.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 hover:cursor-pointer transition-colors">
                                    {columns.map((col, j) => (
                                        <td key={j} className="px-6 py-4">
                                            {col.cell ? col.cell(item) : (item[col.accessorKey] as React.ReactNode)}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-6 py-4 text-right space-x-2">{actions(item)}</td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
