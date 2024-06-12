import { useRef, useState } from 'react'

import { CardContentForm } from './card-elements/CardContentForm'

import { useOutsideClick } from '../../hooks/useOutsideClick'

import styles from './Card.module.css'
import { CardModelData } from '../../data'
import { formatDate } from '../../utils/dates'

interface CardProps extends CardModelData {
  onUpdateCard?(updatedCard: CardModelData): void
  onDeleteCard?(cardId: number): void
}

export const Card = (props: CardProps) => {
  const ref = useRef(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isEditing, setEditing] = useState(false)
  const [fontShrinkagePx, setFrontShrinkagePx] = useState(0)

  const handleSetEditingOff = () => {
    setEditing(false)
  }

  useOutsideClick(ref, handleSetEditingOff)

  const handleSetEditingOn = () => {
    setEditing(true)
  }

  const handleSaveContent = (values: CardModelData) => {
    props.onUpdateCard && props.onUpdateCard(values)
    handleSetEditingOff()
  }

  const autoshrinkFontSize = () => {
    const fontShrinkagePxMax = 100;
    let fontShrinkagePxCurrent = fontShrinkagePx;
    shrinkUntilNoOverflow: while (editorRef.current) {
      if (fontShrinkagePxCurrent >= fontShrinkagePxMax) {
        break shrinkUntilNoOverflow;
      }
      if (editorRef.current.clientWidth == editorRef.current.offsetWidth) {
        break shrinkUntilNoOverflow;
      }

      fontShrinkagePxCurrent += 2;
      containerRef.current?.style.setProperty("--font-shrinkage-px", `${fontShrinkagePxCurrent}px`);
    }

    if (fontShrinkagePxCurrent != fontShrinkagePx) {
      setFrontShrinkagePx(fontShrinkagePxCurrent);
    }
  }


  return (
    <div
      data-cy={`card-${props.id}`}
      className={styles.card}
      onClick={handleSetEditingOn}
      ref={containerRef}
    >
      <p className={styles.date}>
        {props.createdAt ? formatDate(props.createdAt) : 'Date'}
      </p>
      {!isEditing ? (
        <p className={styles.content}>{props?.content || 'Click to start noting'}</p>
      ) : (
        <CardContentForm
          initialValues={props}
          onSubmit={handleSaveContent}
          onInput={autoshrinkFontSize}
          onDeleteCard={props.onDeleteCard}
          editorRef={editorRef}
        />
      )}
    </div>
  )
}
