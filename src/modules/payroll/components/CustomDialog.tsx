import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

interface CustomDialogProps {
  title: string;
  open: boolean;
  content?: React.ReactNode;
  actions: React.ReactNode;
}

export function CustomDialog({ title, open, content, actions }: CustomDialogProps) {
    
  return (
      <Dialog
        open={open}
        PaperProps={{ style: { padding: '15px' } }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
  )
}