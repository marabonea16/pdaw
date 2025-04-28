"use client";

import Sidebar from "../components/sidebar";

const CreateTeacherPage = () => {
    return (
        <div className="min-h-screen bg-gray-100"> 
            <Sidebar/>
            <div className="container mx-auto px-50 max-w-4xl py-30">
                <h2 className="text-3xl font-bold text-gray-700 text-center mb-12">Create New Teacher</h2>
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter teacher name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter teacher email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gray-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Create Teacher
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateTeacherPage;