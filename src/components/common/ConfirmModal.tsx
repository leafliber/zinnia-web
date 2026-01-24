import React from 'react'
import { Modal } from 'antd'

// 组件形式的确认弹窗
interface ConfirmModalComponentProps {
  open: boolean
  title: string
  content: React.ReactNode
  onConfirm: () => void
  onCancel: () => void
  confirmLoading?: boolean
  okText?: string
  cancelText?: string
  danger?: boolean
}

export const ConfirmModal: React.FC<ConfirmModalComponentProps> = ({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmLoading = false,
  okText = '确定',
  cancelText = '取消',
  danger = false,
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger }}
    >
      {content}
    </Modal>
  )
}
