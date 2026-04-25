import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetClassroomQuery } from "../../../redux/hooks/classroomApiSlice";
import ClassroomTableComponent from "./ClassroomTableComponent";

const Classrooms = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const navigate = useNavigate();

    const { data: classroomData, isLoading, refetch } = useGetClassroomQuery();
    const [classrooms, setClassrooms] = useState([]);

    console.log("classroom data", classroomData);
    useEffect(() => {
        if (classroomData?.data) {
            setClassrooms(classroomData.data);
        }
    }, [classroomData]);


    const filteredClassroom = Array.isArray(classrooms)
        ? classrooms.filter((classroom) =>
            `${classroom.class_name ?? ""}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (classroom.email ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleEdit = (classroom) => {
        console.log("Edit classroom:", classroom.id);
        navigate(`${classroom.id}`);
    };

    const addNew = () => {
        navigate("createClassroom");
    };

    return (
        <div >
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Classroom Management
                        </h1>
                        <p className="text-gray-600">Manage your classrooms efficiently</p>
                    </div>
                    <button
                        onClick={addNew}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Classroom
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search classrooms by name, department, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button> */}
                </div>

                {/* Teacher Table */}
                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading...</div>
                ) : (
                    <ClassroomTableComponent
                        classrooms={filteredClassroom}
                        onEdit={handleEdit}
                    />
                )}
            </div>
        </div>
    );
};

export default Classrooms;
