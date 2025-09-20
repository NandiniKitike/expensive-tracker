'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Member } from '@/types';
import { MdOutlineDelete, MdOutlineModeEditOutline } from "react-icons/md";

interface MemberManagerProps {
  members: Member[];
  onMembersChange: (members: Member[]) => void;
  onClose: () => void;
}

export default function MemberManager({ members, onMembersChange, onClose }: MemberManagerProps): JSX.Element {
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const addMember = (): void => {
    if (!newMemberName.trim()) {
      toast.error('Please enter a member name');
      return;
    }

    if (members.some(member => member.name.toLowerCase() === newMemberName.toLowerCase())) {
      toast.error('Member name already exists');
      return;
    }

    const newMember: Member = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      isActive: true
    };

    onMembersChange([...members, newMember]);
    setNewMemberName('');
    toast.success(`Added ${newMember.name} to the group`);
  };

  const removeMember = (memberId: string): void => {
    const memberToRemove = members.find(m => m.id === memberId);
    if (!memberToRemove) return;

    if (members.filter(m => m.isActive).length <= 2) {
      toast.error('You need at least 2 members in the group');
      return;
    }

    const updatedMembers = members.filter(m => m.id !== memberId);
    onMembersChange(updatedMembers);
    toast.success(`Removed ${memberToRemove.name} from the group`);
  };

  const startEditing = (member: Member): void => {
    setEditingId(member.id);
    setEditingName(member.name);
  };

  const saveEdit = (): void => {
    if (!editingName.trim()) {
      toast.error('Member name cannot be empty');
      return;
    }

    if (members.some(member => 
      member.id !== editingId && 
      member.name.toLowerCase() === editingName.toLowerCase()
    )) {
      toast.error('Member name already exists');
      return;
    }

    const updatedMembers = members.map(member => 
      member.id === editingId 
        ? { ...member, name: editingName.trim() }
        : member
    );

    onMembersChange(updatedMembers);
    setEditingId(null);
    setEditingName('');
    toast.success('Member name updated');
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold"> Manage Group Members</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Add New Member */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Add New Member</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter member name"
            onKeyPress={(e) => e.key === 'Enter' && addMember()}
          />
          <button
            onClick={addMember}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      {/* Current Members */}
      <div>
        <h3 className="font-medium mb-3">Current Members ({members.length})</h3>
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
              {editingId === member.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    autoFocus
                  />
                  <button
                    onClick={saveEdit}
                    className="text-green-600 hover:text-green-800 px-2"
                  >
                    ✓
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditing(member)}
                      className="text-blue-600 hover:text-blue-800 px-2"
                      title="Edit name"
                    >
                     <MdOutlineModeEditOutline />
                    </button>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="text-red-600 hover:text-red-800 px-2"
                      title="Remove member"
                      disabled={members.length <= 2}
                    >
                     <MdOutlineDelete />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onClose}
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          Done
        </button>
      </div>
    </div>
  );
}
