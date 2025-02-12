"use client";

import { useFetchAllTestimonials } from "@/hooks/testimonialHooks";
import { useEffect, useState } from "react";
import { TestimonialData } from "@/interfaces/testimonial";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = Cookies.get("isAdmin");

    if (!isAdmin) {
      // Redirect to login if the user is not an admin
      router.push("/");
    }
  }, [router]);
  const { testimonials, refetchTestimonials } = useFetchAllTestimonials();
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rating: "",
    testimonial: "",
    imageUrl: null as File | null,
  });

  const handleAddDrawerOpen = () => {
    setFormData({
      name: "",
      rating: "",
      testimonial: "",
      imageUrl: null,
    }); // Clear form data when opening Add Drawer
    setIsAddDrawerOpen(true);
  };

  const handleEditDrawerOpen = (testimonial: TestimonialData) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      rating: testimonial.rating.toString(),
      testimonial: testimonial.testimonial,
      imageUrl: null, // Do not keep the old image, so it is not prefilled
    });
    setIsEditDrawerOpen(true);
  };

  const handleViewDrawerOpen = (testimonial: TestimonialData) => {
    setSelectedTestimonial(testimonial);
    setIsViewDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsAddDrawerOpen(false);
    setIsEditDrawerOpen(false);
    setIsViewDrawerOpen(false);
    setSelectedTestimonial(null);
  };

  const handleDeleteClick = async (_id: string) => {
    const confirmation = window.confirm("Are you sure you want to delete this category?");
    if(confirmation) {
    setDeletingId(_id);
    try {
      const response = await fetch(`/api/testimonial/${_id}`, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        toast.success("Testimonial deleted successfully!");
        await refetchTestimonials(); // Refetch instead of reload
      } else {
        toast.error(`Failed to delete testimonial: ${data.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the testimonial.");
    } finally {
      setDeletingId(null);
    }
  }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const testimonialData = new FormData();
    let hasChanges = false;

    if (isEditDrawerOpen && selectedTestimonial) {
      // Edit mode logic
      if (formData.name !== selectedTestimonial.name) {
        testimonialData.append("name", formData.name);
        hasChanges = true;
      }
      if (formData.rating !== selectedTestimonial.rating.toString()) {
        testimonialData.append("rating", formData.rating);
        hasChanges = true;
      }
      if (formData.testimonial !== selectedTestimonial.testimonial) {
        testimonialData.append("testimonial", formData.testimonial);
        hasChanges = true;
      }
      if (formData.imageUrl) {
        testimonialData.append("imageUrl", formData.imageUrl);
        hasChanges = true;
      }
    } else {
      // Create mode logic
      testimonialData.append("name", formData.name);
      testimonialData.append("rating", formData.rating);
      testimonialData.append("testimonial", formData.testimonial);
      if (formData.imageUrl) {
        testimonialData.append("imageUrl", formData.imageUrl);
      }
      hasChanges = true;
    }

    if (!hasChanges && isEditDrawerOpen) {
      toast.error("No changes detected");
      setIsLoading(false);
      return;
    }

    try {
      const url = isEditDrawerOpen && selectedTestimonial
        ? `/api/testimonial/${selectedTestimonial._id}`
        : "/api/testimonial";

      const response = await fetch(url, {
        method: isEditDrawerOpen ? "PUT" : "POST",
        body: testimonialData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(isEditDrawerOpen ? "Testimonial updated successfully!" : "Testimonial added!");
        handleDrawerClose();
        await refetchTestimonials(); // Refetch instead of reload
      } else {
        toast.error(data.message || "Failed to submit testimonial.");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error("An error occurred while submitting.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!testimonials) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin text-gray-500" size={32} />
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button onClick={handleAddDrawerOpen}>Add Testimonial</Button>
      </div>

      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Testimonial</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="text-end pr-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial._id}>
              <TableCell>{testimonial.name}</TableCell>
              <TableCell>{testimonial.rating}</TableCell>
              <TableCell>{testimonial.testimonial}</TableCell>
              <TableCell>
                <img src={testimonial.imageUrl} alt="User" className="h-12 w-12 rounded-full object-cover" />
              </TableCell>
              <TableCell className="text-end pr-3">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleViewDrawerOpen(testimonial)}>View</button>

                <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2 " onClick={() => handleEditDrawerOpen(testimonial)}>Edit</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2" onClick={() => handleDeleteClick(testimonial._id)} disabled={deletingId === testimonial._id}>
                  {deletingId === testimonial._id ? <Loader2 className="animate-spin" /> : "Delete"}
                </button>
              </TableCell>
            </TableRow>

          ))}
        </TableBody>
      </Table>

      {/* View Drawer */}
      {isViewDrawerOpen && selectedTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4">
            <button className="text-white bg-red-500 px-4 py-2 rounded-md" onClick={handleDrawerClose}>Close</button>
            <h2 className="text-xl font-bold mt-4"><strong>User:</strong> {selectedTestimonial.name}</h2>
            <p className="mt-2"><strong>Rating:</strong> {selectedTestimonial.rating}</p>
            <p className="mt-2"><strong>Testimonial:</strong> {selectedTestimonial.testimonial}</p>
            <img src={selectedTestimonial.imageUrl} alt={selectedTestimonial.name} className="mt-4 rounded-full" />
          </div>
        </div>
      )}

      {/* Add Drawer */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4">
            <button className="text-white bg-red-500 px-4 py-2 rounded-md" onClick={handleDrawerClose}>Close</button>
            <h2 className="text-xl font-bold mt-4">Add Testimonial</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div><label className="block text-sm font-medium">Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" /></div>
              <div><label className="block text-sm font-medium">Rating</label><input type="number" name="rating" value={formData.rating} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" max="5"  /></div>
              <div><label className="block text-sm font-medium">Testimonial</label><textarea name="testimonial" value={formData.testimonial} onChange={handleInputChange} className="w-full px-3 py-2 border rounded"></textarea></div>
              <div><label className="block text-sm font-medium">Image URL</label><input type="file" name="imageUrl" onChange={handleFileChange} className="w-full px-3 py-2 border rounded" /></div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (<><Loader2 className="animate-spin" /> Creating testimonial...</>) : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Drawer */}
      {isEditDrawerOpen && selectedTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4">
            <button className="text-white bg-red-500 px-4 py-2 rounded-md" onClick={handleDrawerClose}>Close</button>
            <h2 className="text-xl font-bold mt-4">Edit Testimonial</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Rating Field */}
              <div>
                <label className="block text-sm font-medium">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  max="5"
               
                />
              </div>

              {/* Testimonial Field */}
              <div>
                <label className="block text-sm font-medium">Testimonial</label>
                <textarea
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Image Preview and Upload */}
              <div>
                <label className="block text-sm font-medium">Image</label>
                {/* Show preview if imageUrl exists */}
                {selectedTestimonial.imageUrl && (
                  <div className="mb-2">
                    <img
                      src={selectedTestimonial.imageUrl}
                      alt="Current Image"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  name="imageUrl"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Updating Testimonial...
                  </>
                ) : (
                  "Submit"
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

export default Page;
