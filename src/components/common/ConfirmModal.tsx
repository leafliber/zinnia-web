import React from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface ConfirmModalProps {
  title: string
  content: string
  onConfirm: () => void | Promise<void>
  okText?: string
  cancelText?: string
  danger?: boolean
}

export const showConfirmModal = ({
  title,
  content,
  onConfirm,
  okText = '确定',
  cancelText = '取消',
  danger = false,
}: ConfirmModalProps) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText,
    cancelText,
    okButtonProps: { danger },
    onOk: onConfirm,
  })
}

// 删除确认弹窗
export const showDeleteConfirm = (itemName: string, onConfirm: () => void | Promise<void>) => {
  showConfirmModal({
    title: '确认删除',
    content: `确定要删除 "${itemName}" 吗？此操作不可恢复。`,
    onConfirm,
    okText: '删除',
    danger: true,
  })
}

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
