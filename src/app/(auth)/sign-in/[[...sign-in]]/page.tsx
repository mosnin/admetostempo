import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'glass shadow-[0_8px_32px_rgba(196,181,253,0.25)] border-0 rounded-3xl',
            headerTitle: 'text-gradient font-bold',
            headerSubtitle: 'text-gray-500',
            formButtonPrimary:
              'bg-gradient-to-r from-violet-400 to-emerald-300 hover:opacity-90 text-white font-semibold rounded-2xl transition-opacity',
            footerActionLink:
              'text-violet-500 hover:text-violet-600 font-medium',
            formFieldInput:
              'rounded-xl border-violet-100 focus:ring-violet-300 focus:border-violet-300',
            identityPreviewEditButton: 'text-violet-500',
            formResendCodeLink: 'text-violet-500',
          },
        }}
      />
    </div>
  )
}
