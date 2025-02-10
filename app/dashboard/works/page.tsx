"use client";

import { useState } from "react";
import { useFetchAllWorks } from "@/hooks/companyHook";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CompanyData } from "@/models/companyModel";
import toast, { Toaster } from "react-hot-toast";


const CompanyTable = () => {
  const works:CompanyData[]|null  = useFetchAllWorks();

  const [deletingId, setDeletingId] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);
  const [selectedWork, setSelectedWork] = useState<any | null>(null); 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 
  const [isAddFormOpen, setIsAddFormOpen] = useState(false); 

  const [formData, setFormData] = useState({
    companyName: "",
    category: "",
    companyDescription: "",
    companyLogo: null as File | null, 
    imagePdf: null as File | null, 
  });

  const handleViewClick = (work: any) => {
    setSelectedWork(work); 
    setIsDrawerOpen(true); 
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false); 
    setSelectedWork(null); 
  };

  const handleAddCompanyClick = () => {
    setIsAddFormOpen(true); 
  };

  const handleDeleteClick = async (_id: string) => {
    setDeletingId(_id); 
    
    const response = await fetch(`/api/company/${_id}`, {
      method: "DELETE",
    });
  
    const data = await response.json();
    
    if (data.success) {
      toast.success("Company deleted successfully!");
      window.location.reload();

    } else {
      toast.error(`Failed to delete company: ${data.message}`);
    }
  
    setDeletingId(null); 
  };
  

  const handleCloseAddForm = () => {
    setIsAddFormOpen(false); 
    setFormData({
      companyName: "",
      category: "",
      companyDescription: "",
      companyLogo: null,
      imagePdf: null,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const companyData = new FormData();
    companyData.append("companyName", formData.companyName);
    companyData.append("category", formData.category);
    companyData.append("companyDescription", formData.companyDescription);
    if (formData.companyLogo) companyData.append("companyLogo", formData.companyLogo);
    if (formData.imagePdf) companyData.append("imagePdf", formData.imagePdf);

    try {
      const response = await fetch("/api/company", {
        method: "POST",
        body: companyData,
      });

      const data = await response.json();
      if (data.success) {
          handleCloseAddForm(); 
        toast.success("Company added successfully!");
        window.location.reload();
      } else {
        toast.error(`Failed to add company: ${data.message}`); 
      }
    } catch (error) {
      toast.error("An error occurred while adding the company.");
    } finally {
        setIsLoading(false);
    }
  };


  if (!works) {
    return   <div className="flex items-center justify-center h-full">
    <Loader2 className="animate-spin text-gray-500" size={32} />
  </div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Company List</h1>
        <Button
          
          onClick={handleAddCompanyClick}
        >
          Add Company
        </Button>
      </div>

      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead>Image PDF</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {works.map((work: CompanyData, index: number) => (
            <TableRow key={index}>
              <TableCell>{work.companyName}</TableCell>
              <TableCell>{work.category}</TableCell>
              <TableCell>{work.companyDescription}</TableCell>
              <TableCell>
                <img src={work.companyLogo} alt="Company Logo" className="h-12 w-12 object-cover rounded-full" />
              </TableCell>
              <TableCell>
                <a href={work.imagePdf} target="_blank"  className="text-blue-600 hover:underline">
                  View PDF
                </a>
              </TableCell>
              <TableCell>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleViewClick(work)}
                >
                  View
                </button> 
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDeleteClick(work._id)}
                  disabled={deletingId === work._id}
                >
                  {deletingId === work._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Drawer for Company Details */}
      {isDrawerOpen && selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4 overflow-auto">
            <button
              className="text-white bg-red-500 px-4 py-2 rounded-md"
              onClick={handleCloseDrawer}
            >
              Close
            </button>
            <div className="mt-4 mx-auto w-full max-w-md ">
              <img src={selectedWork.companyLogo} alt="Company Logo" className="rounded-full " />
            </div>
            <h2 className="text-xl font-bold mt-4">{selectedWork.companyName}</h2>
            <p className="mt-2">
              <strong>Category:</strong> {selectedWork.category}
            </p>
            <p className="mt-2">
              <strong>Description:</strong> {selectedWork.companyDescription}
            </p>
            <div className="mt-4">
              <strong>PDF:</strong>
              <a
                href={selectedWork.imagePdf}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                View PDF
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Drawer for Add Company Form */}
      {isAddFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4 overflow-auto">
            <button
              className="text-white bg-red-500 px-4 py-2 rounded-md"
              onClick={handleCloseAddForm}
            >
              Close
            </button>
            <h2 className="text-xl font-bold mt-4">Add Company</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="companyDescription"
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                  placeholder="Enter description"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium">Logo</label>
                <input
                  type="file"
                  name="companyLogo"
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Image PDF</label>
                <input
                  type="file"
                  name="imagePdf"
                  accept=".pdf"
                  className="w-full px-3 py-2 border rounded"
                  onChange={handleFileChange}
                />
              </div>
              <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  creating company...
                </>
              ) : (
                'Submit'
              )}
            </Button>
            </form>
          </div>
        </div>
      )}

<Toaster />
    </div>
  );
};

export default CompanyTable;
