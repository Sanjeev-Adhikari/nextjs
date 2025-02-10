"use client";

import { useFetchAllInbox } from "@/hooks/inboxHooks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const Page = () => {
  const [selectedWork, setSelectedWork] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const inbox = useFetchAllInbox();

  const handleViewClick = (inbox: any) => {
    setSelectedWork(inbox);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedWork(null);
  };

  if (!inbox) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inbox Messages</h1>

      {inbox.length === 0 ? (
        <p className="text-gray-500">No messages in the inbox.</p>
      ) : (
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inbox.map((message: any) => (
              <TableRow key={message._id}>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>{message.phone}</TableCell>
                <TableCell>{message.message}</TableCell>
                <TableCell>{message.companyName}</TableCell>
                <TableCell>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleViewClick(message)}
                  >
                    View
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Drawer for Inbox Details */}
      {isDrawerOpen && selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4 overflow-auto">
            <button
              className="text-white bg-red-500 px-4 py-2 rounded-md"
              onClick={handleCloseDrawer}
            >
              Close
            </button>

            {/* Inbox Details */}
            <h2 className="text-xl font-bold mt-4">Inquiry received from {selectedWork.name}</h2>
            <p className="mt-2">
              <strong>Email:</strong> {selectedWork.email}
            </p>
            <p className="mt-2">
              <strong>Phone Number:</strong> {selectedWork.phone}
            </p>
            <p className="mt-2">
              <strong>Message:</strong> {selectedWork.message}
            </p>
            <p className="mt-2">
              <strong>Company Name:</strong> {selectedWork.companyName}
            </p>

            
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
