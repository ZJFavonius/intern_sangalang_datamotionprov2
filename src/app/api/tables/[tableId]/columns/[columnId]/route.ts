import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { tableId: string; columnId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const column = await prisma.column.findUnique({
      where: { id: params.columnId },
      include: {
        table: {
          include: {
            workspace: {
              include: { members: { where: { userId: session.user.id } } },
            },
          },
        },
      },
    })

    if (!column || column.table.workspace.members.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const updated = await prisma.column.update({
      where: { id: params.columnId },
      data: {
        ...(body.name !== undefined && { name: body.name }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tableId: string; columnId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const column = await prisma.column.findUnique({
      where: { id: params.columnId },
      include: {
        table: {
          include: {
            workspace: {
              include: { members: { where: { userId: session.user.id } } },
            },
          },
        },
      },
    })

    if (!column || column.table.workspace.members.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.column.delete({ where: { id: params.columnId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
