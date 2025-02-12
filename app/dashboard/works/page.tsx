"use client";

import { useEffect, useState } from "react";
import { useFetchAllWorks } from "@/hooks/companyHook";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CompanyData } from "@/models/companyModel";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import PDFViewer from "@/components/pdf";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchAllCategories } from "@/hooks/categoryHooks";

const CompanyTable = () => {
  const router = useRouter();
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const categories = useFetchAllCategories();
  const fetchedCategories: any = categories.categories;

  useEffect(() => {
    const isAdmin = Cookies.get("isAdmin");
    if (!isAdmin) {
      router.push("/");
    }
  }, [router]);

  const { works, refetchWorks } = useFetchAllWorks();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWork, setSelectedWork] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    category: "",
    companyDescription: "",
    companyLogo: null as File | null,
    imagePdf: null as File | null,
  });

  const handleViewClick = (work: CompanyData) => {
    setSelectedWork(work);
    setIsDrawerOpen(true);
  };
  const handlePdfView = (pdfUrl: string) => {
    console.log('Original PDF URL:', pdfUrl);
    setSelectedPdfUrl(pdfUrl);
    setIsPdfViewerOpen(true);
  };
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedWork(null);
  };
  const handleAddCompanyClick = () => {
    setIsAddFormOpen(true);
  };
  const handleEditClick = (work: CompanyData) => {
    setFormData({
      companyName: work.companyName,
      category: work.category,
      companyDescription: work.companyDescription,
      companyLogo: null,
      imagePdf: null,
    });
    setSelectedWork({
      ...work,
      existingLogoUrl: work.companyLogo,  // Add existing URLs
      existingPdfUrl: work.imagePdf
    });
    setIsEditFormOpen(true);
  };
  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    resetForm();
  };
  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setSelectedWork(null);
    resetForm();
  };
  const resetForm = () => {
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
  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent, isEdit = false) => {
    e.preventDefault();
    setIsLoading(true);
    const companyData = new FormData();
    companyData.append("companyName", formData.companyName);
    companyData.append("category", formData.category);
    companyData.append("companyDescription", formData.companyDescription);
    if (formData.companyLogo) companyData.append("companyLogo", formData.companyLogo);
    if (formData.imagePdf) companyData.append("imagePdf", formData.imagePdf);
    try {
      const response = await fetch(isEdit && selectedWork ? `/api/company/${selectedWork._id}` : "/api/company", {
        method: isEdit ? "PUT" : "POST",
        body: companyData,
      });
      const data = await response.json();
      if (data.success) {
        isEdit ? handleCloseEditForm() : handleCloseAddForm();
        toast.success(`Company ${isEdit ? "updated" : "added"} successfully!`);
        refetchWorks();
      } else {
        toast.error(`Failed to ${isEdit ? "update" : "add"} company: ${data.message}`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${isEdit ? "updating" : "adding"} the company.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const companyData = new FormData();
    companyData.append("companyName", formData.companyName);
    companyData.append("category", formData.category);
    companyData.append("companyDescription", formData.companyDescription);

    // Handle logo separately
    if (formData.companyLogo) {
      companyData.append("companyLogo", formData.companyLogo);
    } else {
      companyData.append("existingLogoUrl", selectedWork?.existingLogoUrl || "");
    }

    // Handle PDF separately
    if (formData.imagePdf) {
      companyData.append("imagePdf", formData.imagePdf);
    } else {
      companyData.append("existingPdfUrl", selectedWork?.existingPdfUrl || "");
    }
    try {
      const response = await fetch(`/api/company/${selectedWork._id}`, {
        method: "PUT",
        body: companyData,
      });
      const data = await response.json();
      if (data.success) {
        handleCloseEditForm();
        toast.success("Company updated successfully!");
        refetchWorks();
      } else {
        toast.error(`Failed to update company: ${data.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while updating the company.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (_id: string) => {

    const confirmation = window.confirm("Are you sure you want to delete this company?");
    if(confirmation) {
      setDeletingId(_id);
    const response = await fetch(`/api/company/${_id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (data.success) { 
      toast.success("Company deleted successfully!");
      refetchWorks();
    } else {
      toast.error(`Failed to delete company: ${data.message}`);
    }
    setDeletingId(null);
  };
}

  if (!works) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Company List</h1>
        <Button onClick={handleAddCompanyClick}>Add Company</Button>
      </div>

      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead>Image PDF</TableHead>
            <TableHead className="text-end pr-[100px]">Actions</TableHead>
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
                <button
                  onClick={() => handlePdfView(work.imagePdf)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  View PDF
                </button>
              </TableCell>
              <TableCell className="text-end pr-3">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleViewClick(work)}
                >
                  View
                </button>
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2"
                  onClick={() => handleEditClick(work)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                  onClick={() => handleDeleteClick(work._id)}
                  disabled={deletingId === work._id}
                >
                  {deletingId === work._id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
            <div className="mt-4 w-[200px]">
              <img src={selectedWork.companyLogo} alt="Company Logo" className="rounded-md" />
            </div>
            <h2 className="text-xl font-semibold mt-4">{selectedWork.companyName}</h2>
            <p className="mt-2">
              <strong className="text-gray-600">Category:</strong> {selectedWork.category}
            </p>
            <p className="mt-2">
              <strong className="text-gray-600">Description:</strong> {selectedWork.companyDescription}
            </p>
            <div className="mt-4">
              <strong className="text-gray-600">PDF:</strong>
              <button
                  onClick={() => handlePdfView(selectedWork.imagePdf)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  View PDF
                </button>
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
            <form onSubmit={(e) => handleSubmit(e)} className="mt-4 space-y-4">
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
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {fetchedCategories.map((category: any) => (
                        <SelectItem key={category._id} value={category.categoryName}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Company...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
      {isEditFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4 overflow-auto">
            <button
              className="text-white bg-red-500 px-4 py-2 rounded-md"
              onClick={handleCloseEditForm}
            >
              Close
            </button>
            <h2 className="text-xl font-bold mt-4">Edit Company</h2>
            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
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
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {fetchedCategories.map((category: any) => (
                        <SelectItem key={category._id} value={category.categoryName}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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

                <div>
                  <label className="block text-sm font-medium">Logo</label>
                  <div className="mb-2">
                    {selectedWork.existingLogoUrl && (
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={selectedWork.existingLogoUrl}
                          alt="Current Logo"
                          className="h-12 w-12 object-cover rounded-full"
                        />

                      </div>
                    )}
                    <input
                      type="file"
                      name="companyLogo"
                      accept="image/*"
                      className="w-full px-3 py-2 border rounded"
                      onChange={handleFileChange}
                    />
                    {formData.companyLogo && (
                      <p className="mt-2 text-sm text-gray-600">
                        New file: {formData.companyLogo.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Image PDF</label>
                  <div className="mb-2">
                    {selectedWork.existingPdfUrl && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">
                          Current PDF: {selectedWork.existingPdfUrl.split('/').pop()}
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      name="imagePdf"
                      accept=".pdf"
                      className="w-full px-3 py-2 border rounded"
                      onChange={handleFileChange}
                    />
                    {formData.imagePdf && (
                      <p className="mt-2 text-sm text-gray-600">
                        New file: {formData.imagePdf.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Company...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
      <PDFViewer
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        pdfUrl={selectedPdfUrl}
      />
      <Toaster />
    </div>
  );
};

export default CompanyTable;
